import request from "supertest";

import { app } from "../../app";
import { createMongoId } from "../../function/create-mongoId";
import { createTicket } from "../../function/create-ticket";

it("returns 404 if the ticket is not found", async () => {
  const id = createMongoId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns 200 if the ticket is found", async () => {
  const res = await createTicket();

  await request(app).get(`/api/tickets/${res.body.id!}`).send().expect(200);
  console.log(res.body);
});
