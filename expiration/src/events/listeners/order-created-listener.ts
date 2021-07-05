// expiration\src\events\listeners\order-created-listener.ts

import { Listener, OrderCreatedEvent, Subjects } from '@angrychaired/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const futureTime = new Date(data.expiresAt).getTime(); // gives expiration time in miliseconds
    const nowTime = new Date().getTime(); // -> gives now time in miliseconds
    const delay = futureTime - nowTime;

    console.log('Waiting for miliseconds', delay);

    //   TODO some logic here do send to redis
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay,
      }
    );

    msg.ack();
  }
}
