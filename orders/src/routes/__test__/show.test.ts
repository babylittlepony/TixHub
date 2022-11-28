import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../function/create-order";

it("fetches the order", async () => {
  const ticket = await createTicket();
  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: data } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(data.id).toEqual(order.id);
});

it("returns 401 for unauthorized fetching the order", async () => {
  const ticket = await createTicket();
  const userOne = signin();
  const userTwo = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id });

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});
