import request from "supertest";

import { app } from "../../app";
import { createMongoId } from "@tixproject/common";
import { createTicket } from "../../functions/create-ticket";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns 404 if tickets id doesnt exist", async () => {
  const id = createMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "test", price: 10 })
    .expect(404);
});

it("returns 401 if user isnt authenticated", async () => {
  const id = createMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "test", price: 10 })
    .expect(401);
});
it("returns 401 if user not authorized to update ticket", async () => {
  const res = await createTicket();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "tist ", price: 69 })
    .expect(401);
});

it("returns 400 if user provides invalid title or price", async () => {
  const cookie = signin();
  const res = await createTicket(cookie).expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 69 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test", price: -69 })
    .expect(400);
});

it("updates the ticket with valid inputs", async () => {
  const cookie = signin();
  const res = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 99,
    })
    .expect(200);

  const updatedRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();
  expect(updatedRes.body.title).toEqual("new title");
  expect(updatedRes.body.price).toEqual(99);
});

it("Publish an event and updating it", async () => {
  const cookie = signin();
  const res = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 99,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updating a reserved ticket", async () => {
  const cookie = signin();
  const res = await createTicket(cookie);

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: createMongoId() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 99,
    })
    .expect(400);
});
