import { Subjects, TicketCreatedEvent, Publisher } from '@angrychaired/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
