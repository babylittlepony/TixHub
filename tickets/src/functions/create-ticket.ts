import request from "supertest";

import { app } from "../app";

const createTicket = (cookie?: string[]) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie! || signin())
    .send({ title: "Test", price: 10 });
};

const ticketNoTitle = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ price: 5 })
    .expect(400);
};

const ticketEmptyTitle = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 5 })
    .expect(400);
};

const ticketNegativePrice = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "test", price: -10 })
    .expect(400);
};

const ticketNoPrice = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "tets" })
    .expect(400);
};
export {
  createTicket,
  ticketEmptyTitle,
  ticketNoPrice,
  ticketNegativePrice,
  ticketNoTitle,
};
