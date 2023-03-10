import request from "supertest";

import { app } from "../../app";

/*------------------------------Testing------------------------------*/
it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with invalid email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testgmail.com",
      password: "password",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "p",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("Sets a cookie after signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
/*------------------------------Testing------------------------------*/
