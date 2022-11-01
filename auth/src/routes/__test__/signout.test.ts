import request from "supertest";

import { app } from "../../app";

/*------------------------------Testing------------------------------*/
it("return 200 on signout and delete cookie", async () => {
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
  const response = await request(app)
    .get("/api/users/signout")
    .send()
    .expect(200);

  //   console.log(response.get("Set-Cookie"));
  expect(response.get("Set-Cookie")).toEqual([
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
/*------------------------------Testing------------------------------*/
