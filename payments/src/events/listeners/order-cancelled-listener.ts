import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //   just mark the order as canceleld

    // TODO this is not good
    // const order = await Order.findById(data.id);
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error('No such order');

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // ack the messae

    msg.ack();
  }
}
