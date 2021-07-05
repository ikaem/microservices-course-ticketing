import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    //   here we just need to

    // mark the order as expirted
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error('No such order');

    // we should check if the order is not paid or something
    if (order.status === OrderStatus.Complete) return msg.ack();
    //   throw new Error('This order has been completed');

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    const updatedOrder = await Order.findById(data.orderId).populate('ticket');

    // emit order cancelled event

    await new OrderCancelledPublisher(this.client).publish({
      id: updatedOrder!.id,
      version: updatedOrder!.version,
      ticket: {
        id: updatedOrder!.ticket.id,
      },
    });
    msg.ack();
  }
}
