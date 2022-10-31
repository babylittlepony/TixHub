import request from "supertest";

import { app } from "../../app";

/*------------------------------Testing------------------------------*/
it("return 200 on signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(200);
});

it("invalid password in existing user", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "p",
    })
    .expect(400);
});

it("invalid password in existing user", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie"));
});
/*------------------------------Testing------------------------------*/
