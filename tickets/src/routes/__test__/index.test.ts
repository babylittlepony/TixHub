import request from "supertest";

import { app } from "../../app";
import { createTicket } from "../../functions/create-ticket";

it("returns a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(3);
});
