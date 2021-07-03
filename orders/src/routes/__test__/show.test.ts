import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // create the ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.signup();
  // makle a request to build an order with this ticket

  const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
});

it("returns 401 if the user tries to access someone else's order", async () => {
  // create the ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user1 = global.signup();
  const user2 = global.signup();
  // makle a request to build an order with this ticket

  const { body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${body.id}`)
    .set('Cookie', user2)
    .send()
    .expect(401);
});
