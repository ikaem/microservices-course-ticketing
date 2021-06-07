// tickets\src\events\publishers\ticket-created-publisher.ts

import { Publisher, Subjects, TicketCreatedEvent } from '@angrychaired/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
