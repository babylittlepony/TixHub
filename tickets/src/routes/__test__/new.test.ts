import request from "supertest";

import { app } from "../../app";

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
