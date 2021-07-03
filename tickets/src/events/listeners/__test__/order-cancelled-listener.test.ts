import { OrderCancelledEvent, OrderStatus } from '@angrychaired/common';
import { Types } from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 20,
    title: 'Concert',
    userId: Types.ObjectId().toHexString(),
  });

  ticket.set({ orderId: Types.ObjectId().toHexString() });

  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 60 * 15);

  const data: OrderCancelledEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('updates the ticket, publishes, acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();
});
