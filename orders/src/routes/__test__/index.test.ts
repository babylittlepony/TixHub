import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { createOrder, createTicket } from "../../function/create-order";

it("fetch order for the user", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = signin();
  const userTwo = signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const res = await request(app).get("/api/orders").set("Cookie", userTwo);
  expect(res.status).toEqual(200);
});
