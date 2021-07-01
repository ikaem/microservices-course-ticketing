// orders\src\events\listeners\ticket-updated-listener.ts

import { Listener, Subjects, TicketUpdatedEvent } from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, version } = data;

    const ticket = await Ticket.findByEvent(data);
    if (!ticket) throw new Error('Ticket not found');

    // ONCE we save the record, the version should be incremented automatically
    // ticket.set({ title, price, version });
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
