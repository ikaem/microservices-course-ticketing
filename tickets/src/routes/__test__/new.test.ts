// tickets\src\test
import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

// jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});
it('can only be accessed if the user is singed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('does not return 401 if a user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({});

  console.log('status', response.status);
  expect(response.status).not.toEqual(401);
});
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
});
it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title: 'Some title',
      // price: 10,
    })
    .expect(400);
});
it('creates a ticket with valid inputs', async () => {
  // TODO later make sure that something was added to the database

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'title', price: 20 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('publishes an event', async () => {
  // we want to create a ticket

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'title', price: 20 })
    .expect(201);

  // and then check if publish was invoked before
  console.log('nats wrapper', natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
