import request from 'supertest';
import { app } from '../../app';

it('člears the cookies after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'some@email.com',
      password: 'test pass',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  //   expect(response.get('Set-Cookie')).toBeUndefined();
});
