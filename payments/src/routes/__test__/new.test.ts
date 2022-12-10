import { createMongoId, OrderStatus } from "@tixproject/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

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

it("returns 201 success with valid inputs", async () => {
  const user = createMongoId();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: createMongoId(),
    status: OrderStatus.Created,
    userId: user,
    version: 0,
    price,
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

  const stripeCharges = await stripe.charges.list({ limit: 30 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === order.price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
