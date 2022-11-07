import request from "supertest";

import { app } from "../../app";

it("has a route handler to /api/tickets for POST req", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});
