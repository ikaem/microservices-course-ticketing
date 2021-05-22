import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'some@email.com',
      password: 'test pass',
    })
    .expect(400);
});

it('fails wwith an incorrect passowrd', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'some@email.com',
      password: 'test pass',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'some@email.com',
      password: 'test s',
    })
    .expect(400);
});

it('sets cookie when good login', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'some@email.com',
      password: 'test pass',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'some@email.com',
      password: 'test pass',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
