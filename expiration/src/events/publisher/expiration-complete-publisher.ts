import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@angrychaired/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
