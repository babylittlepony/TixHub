import request from "supertest";

import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("responds null for not authenticated user", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body).toEqual({ currentUser: null });
});
