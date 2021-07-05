import { ExpirationCompleteEvent } from '@angrychaired/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });

  await ticket.save();

  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
    userId: new Types.ObjectId().toHexString(),
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, ticket, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(data.orderId);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emites an OrderCancelled Event', async () => {
  // TODO do the same wiuth setup
  const { listener, ticket, order, data, msg } = await setup();

  // call on message
  await listener.onMessage(data, msg);

  // make sure that nats wrapper client publish waas called

  expect(
    JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]).id
  ).toEqual(data.orderId);
  expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();

  //   expect(
  //     (natsWrapper.client.publish as jest.Mock).mock.calls[0][0].orderId
  //   ).toEqual(data.orderId);
});

it('acks the message', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
