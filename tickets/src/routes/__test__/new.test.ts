import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler to /api/tickets for POST req", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed with authorized user", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  // Title is empty
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 5 })
    .expect(400);

  // Not provided title
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ price: 5 })
    .expect(400);

  // expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid price is provided", async () => {
  // Price is negative
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "test", price: -10 })
    .expect(400);

  // Not provided price
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "tets" })
    .expect(400);

  // expect(response.statusCode).not.toEqual(401);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "Test", price: 10 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
