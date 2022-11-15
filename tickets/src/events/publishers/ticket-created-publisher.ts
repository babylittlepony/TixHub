import { Publisher, Subjects, TicketCreatedEvent } from "@tixproject/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
