import { Publisher, OrderCancelledEvent, Subjects } from "@tixproject/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
