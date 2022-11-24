import { OrderStatus } from "@tixproject/common";
import { Order } from "../models/order";
import { Ticket, TicketDoc } from "../models/ticket";

export const createTicket = () => {
  const ticket = Ticket.build({
    title: "CONCERT",
    price: 69,
  });
  return ticket;
};

export const createOrder = (ticket: TicketDoc) => {
  const order = Order.build({
    ticket: ticket,
    userId: "userid",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  return order;
};
