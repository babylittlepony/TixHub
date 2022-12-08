import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tixproject/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
