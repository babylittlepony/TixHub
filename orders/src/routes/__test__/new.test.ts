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
  const ticket = createTicket();
  await ticket
    .save()
    .then((data) => console.log("Ticket saved", data))
    .catch((err) => console.error(err));

  const order = createOrder(ticket);
  await order
    .save()
    .then((data) => console.log("Order created", data))
    .catch((err) => console.error(err));

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("order a ticket", async () => {
  const ticket = createTicket();
  await ticket
    .save()
    .then((data) => console.log("Ticket saved", data))
    .catch((err) => console.error(err));

  const req = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket._id });

  // console.log(req);
  expect(req.statusCode).toEqual(201);
});
