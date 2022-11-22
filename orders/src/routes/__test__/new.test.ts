import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns error if ticket doesnt exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("returns error if ticket already reserved", async () => {});

it("order a ticket", async () => {});
