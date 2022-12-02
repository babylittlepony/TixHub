import { createMongoId, TicketCreatedEvent } from "@tixproject/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: createMongoId(),
    title: "Conecerttoo",
    price: 5,
    userId: createMongoId(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("create and save a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
