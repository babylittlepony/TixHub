import request from "supertest";

import { app } from "../../app";
import {
  createTicket,
  ticketEmptyTitle,
  ticketNegativePrice,
  ticketNoPrice,
  ticketNoTitle,
} from "../../function/create-ticket";
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
  await ticketEmptyTitle();
  await ticketNoTitle();
});

it("returns an error if invalid price is provided", async () => {
  await ticketNegativePrice();
  await ticketNoPrice();
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await createTicket();

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
