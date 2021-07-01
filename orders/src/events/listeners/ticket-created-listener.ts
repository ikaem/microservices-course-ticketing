// orders\src\events\listeners\ticket-created-listener.ts

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@angrychaired/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
