// orders\src\events\listeners\payment-created-listener.ts

import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    /* here we find the order  */

    const order = await Order.findById(data.orderId);

    if (!order) throw new Error('No such order');

    order.set({ status: OrderStatus.Complete });

    await order.save();

    // then we mark it as completed

    // we should probably emit event that an order has been completed
    // new Order

    // then we ack
    msg.ack();
  }
}
