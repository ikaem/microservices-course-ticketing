import { Listener, OrderCancelledEvent, Subjects } from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatePublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // find the ticket

    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) throw new Error('No such ticket');
    // mark the ticket as unreserved

    ticket.set({ orderId: undefined });
    // save marked ticket
    await ticket.save();
    // get updated ticket
    const unreservedTicket = await Ticket.findById(data.ticket.id);
    // publish event of updated ticket

    await new TicketUpdatePublisher(this.client).publish({
      id: unreservedTicket!.id,
      price: unreservedTicket!.price,
      title: unreservedTicket!.title,
      userId: unreservedTicket!.userId,
      version: unreservedTicket!.version,
      orderId: unreservedTicket!.orderId,
    });
    // ack it

    msg.ack();
  }
}
