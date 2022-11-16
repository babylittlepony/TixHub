import { Publisher, Subjects, TicketUpdatedEvent } from "@tixproject/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
