import request from 'supertest';

import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  const response = await request(app)
    .get('/api/tickets/60a8d759a864ae22c8296345')
    .send()
    .expect(200);

  console.log('this is the response', response.body);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20.0;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price,
    })
    .expect(201);

  const { id } = response.body;

  const ticketResponse = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
