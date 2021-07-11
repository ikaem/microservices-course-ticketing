import { PaymentCreatedEvent, Publisher, Subjects } from '@angrychaired/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
