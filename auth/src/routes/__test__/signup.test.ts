// auth\src\routes\__test__\signup.test.ts
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'bad email',
      password: 'some password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'k@k.com',
      password: 's',
    })
    .expect(400);
});

it('returns a 400 with invalid login details', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('returns a 400 with missing login details, individually', async () => {
  await request(app).post('/api/users/signup').send({}).expect(400);
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'k@k.com',
      password: 'test',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'k@k.com',
      password: 'test',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'k@k.com',
      password: 'test',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
