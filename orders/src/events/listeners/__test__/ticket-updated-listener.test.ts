import { createMongoId, TicketUpdatedEvent } from "@tixproject/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: createMongoId(),
    title: "COnncret",
    price: 81,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    userId: "userId",
    title: "Update concret",
    price: 71,
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a tiicket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.title).toEqual(data.title);
  expect(updateTicket!.price).toEqual(data.price);
  expect(updateTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skippped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
