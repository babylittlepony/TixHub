import { Publisher, OrderCreatedEvent, Subjects } from "@tixproject/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
