// tickets\src\events\listeners\__test__\order-created-listener.test.ts

import { OrderCreatedEvent, OrderStatus } from '@angrychaired/common';
import { Types } from 'mongoose';

import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 20,
    title: 'Concert',
    userId: Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 60 * 15);

  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: expiration.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: Types.ObjectId().toHexString(),
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const reservedTicket = await Ticket.findById(data.ticket.id);

  expect(reservedTicket!.id).toEqual(ticket.id);
  expect(reservedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  //   expect(ticketUpdatedData.id).toEqual(data.id);

  /* 
      [
      [
        'ticket:updated',
        '{"id":"60e04b99a36fba09d82aa9fd","price":20,"title":"Concert","userId":"60e04b99a36fba09d82aa9fc","version":1,"orderId":"60e04b99a36fba09d82aa9fe"}',
        [Function (anonymous)]
      ]
    ]

  
  */
});
