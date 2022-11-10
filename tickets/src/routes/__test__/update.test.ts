import request from "supertest";

import { app } from "../../app";
import { createMongoId } from "../../function/create-mongoId";
import { createTicket } from "../../function/create-ticket";

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
  const update = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "tist ", price: 69 })
    .expect(401);
  console.log(update.body);
});
it("returns 400 if user provides invalid title or price", async () => {});
it("updates the ticket with valid inputs", async () => {});
