// tickets\src\events\listeners\order-created-listener.ts
import { Listener, OrderCreatedEvent, Subjects } from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatePublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //   TODO here we should lock the ticket

    // find the ticket being reserved by the order
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket) throw new Error('No such ticket');

    // mark the ticket as being reserved - we set order id property on
    ticket.set({ orderId: data.id });

    // save the tickt
    await ticket.save();

    const updatedTicket = await Ticket.findById(data.ticket.id);

    // publish the event o reflect the updated ticket
    await new TicketUpdatePublisher(this.client).publish({
      id: updatedTicket!.id,
      price: updatedTicket!.price,
      title: updatedTicket!.title,
      userId: updatedTicket!.userId,
      version: updatedTicket!.version,
      orderId: updatedTicket!.orderId,
    });

    // ack the message

    msg.ack();
  }
}
