import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('cancels the order', async () => {
  // create the ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create the user
  const user = global.signup();

  // create the order with the ticket
  const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  console.log('bodyyyyyy', body);

  // send the request to delete the order
  const res = await request(app)
    .delete(`/api/orders/${body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  console.log('res body', res.body);

  expect(res.body.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emitrs an order cancel event');
