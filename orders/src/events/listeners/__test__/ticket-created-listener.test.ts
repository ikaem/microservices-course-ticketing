// orders\src\events\listeners\__test__\ticket-created-listener.test.ts

import { TicketCreatedEvent } from '@angrychaired/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create an isntance of the listener
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a message', async () => {
  const { listener, data, msg } = await setup();
  // call the on message function with the data object + message object
  await listener.onMessage(data, msg);
  // write assrtzions to make sure a ticket was created

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the on message function with the data object + message object
  await listener.onMessage(data, msg);
  // write assrtzions to make sure ack function is called

  expect(msg.ack).toHaveBeenCalled();
});
