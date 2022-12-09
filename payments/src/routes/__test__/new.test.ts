import { createMongoId, OrderStatus } from "@tixproject/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("throw not found error", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "testtoken",
      orderId: createMongoId(),
    })
    .expect(404);
});
it("throw not authorized for incorrect user", async () => {
  const order = Order.build({
    id: createMongoId(),
    status: OrderStatus.Created,
    userId: createMongoId(),
    version: 0,
    price: 15,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "testtoken",
      orderId: order.id,
    })
    .expect(401);
});
it("throw bad request if trying to pay cancelled order", async () => {
  const user = createMongoId();
  const order = Order.build({
    id: createMongoId(),
    status: OrderStatus.Cancelled,
    userId: user,
    version: 0,
    price: 15,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(user))
    .send({
      token: "testtoken",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 204 with valid inputs", async () => {
  const user = createMongoId();
  const order = Order.build({
    id: createMongoId(),
    status: OrderStatus.Created,
    userId: user,
    version: 0,
    price: 15,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(user))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(stripeOptions.source).toEqual("tok_visa");
  expect(stripeOptions.amount).toEqual(15 * 100);
  expect(stripeOptions.currency).toEqual("usd");
});
