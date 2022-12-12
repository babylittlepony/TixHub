import { PaymentCreatedEvent, Publisher, Subjects } from "@tixproject/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
