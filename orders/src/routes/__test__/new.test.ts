import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns and error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);

  const order = Order.build({
    userId: '23',
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reservers a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits an order created event');
