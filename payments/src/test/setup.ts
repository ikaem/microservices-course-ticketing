// payments\src\test\setup.ts

import { sign } from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      // TODO someting here
      signup: (orderId?: string) => string[];
    }
  }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51JAIoQBmBwN2aPYS5cKAa9phi9fbjBoUPQJRmcC3we83B1XBB5FdD9efEVphjj5UaExjUpD5KFIHCvqVofO3ra5n00mvUrI9dh';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'testing';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

(global as any).signup = (orderId?: string) => {
  console.log({ orderId });
  // build a jwt payload {id, email}
  const payload = {
    id: orderId || mongoose.Types.ObjectId().toHexString(),
    email: 'some@ema.il',
  };
  // create the jwt
  const token = sign(payload, process.env.JWT_KEY as string);
  // build session object { jwt: my jwt }
  const session = { jwt: token };
  // turn the sesion into json
  const sessionJSON = JSON.stringify(session);
  // encode the json as base 64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return string that it sthe cookie with the encoded data
  return [`express:sess=${base64}`];
};
