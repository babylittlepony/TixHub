import { OrderStatus } from "@tixproject/common";
import { Order } from "../models/order";
import { Ticket, TicketDoc } from "../models/ticket";

export const createTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: "CONCERT",
    price: 69,
  });
  await ticket.save();
  return ticket;
};

export const createOrder = async (ticket: TicketDoc) => {
  const order = Order.build({
    ticket: ticket,
    userId: "userid",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  return order;
};
