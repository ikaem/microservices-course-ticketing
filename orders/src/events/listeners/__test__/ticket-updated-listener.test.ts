import { TicketUpdatedEvent } from '@angrychaired/common';
import { Types } from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create a save a ticket into the ticket collection
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 10,
  });

  await ticket.save();
  // create fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: ticket.title,
    price: 30,
    userId: new Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };
  // create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return all
  return {
    listener,
    ticket,
    data,
    msg,
  };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.id).toEqual(ticket.id);
  expect(updatedTicket!.price).toEqual(data.price);
});
it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message if the version is out of order', async () => {
  const { listener, ticket, data, msg } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (e) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
