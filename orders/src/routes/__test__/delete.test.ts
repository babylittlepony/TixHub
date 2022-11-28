import { OrderStatus } from "@tixproject/common";
import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../function/create-order";
import { Order } from "../../models/order";

it("marks an order as cancelled", async () => {
  const ticket = await createTicket();

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
