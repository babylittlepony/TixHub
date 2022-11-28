import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../function/create-order";

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

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const res = await request(app).get("/api/orders").set("Cookie", userTwo);
  console.log(res.body);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
  expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});
