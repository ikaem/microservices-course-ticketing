import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  //   create cookies for different users
  const user1 = global.signup();
  const user2 = global.signup();

  // create one order as User#1

  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // create two order as User#2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  //   make request for user2's orders

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  console.log('this is response', response);

  expect(response.body.length).toBe(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
});
