import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { createOrder, createTicket } from "../../function/create-order";

it("returns error if ticket doesnt exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("returns error if ticket already reserved", async () => {
  const ticket = await createTicket();

  await createOrder(ticket);

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("order a ticket", async () => {
  const ticket = await createTicket();
  const req = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id });

  expect(req.statusCode).toEqual(201);
});
