import {
  createMongoId,
  OrderCreatedEvent,
  OrderStatus,
} from "@tixproject/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concret",
    price: 10,
    userId: "userId",
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: createMongoId(),
    userId: "userDi",
    status: OrderStatus.Created,
    expiresAt: "idontknow",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
