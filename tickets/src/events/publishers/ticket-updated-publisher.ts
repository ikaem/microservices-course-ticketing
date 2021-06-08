// tickets\src\events\publishers\ticket-updated-publisher.ts

import { Publisher, Subjects, TicketUpdatedEvent } from '@angrychaired/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
