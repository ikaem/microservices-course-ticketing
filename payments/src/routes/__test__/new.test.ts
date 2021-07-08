// payments\src\routes\__test__\new.test.ts

import request from 'supertest';
import { Types } from 'mongoose';

import { app } from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { stripe } from '../../stripe';
import { OrderStatus } from '@angrychaired/common';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe.ts');

it('throws error if purchase order that does not exist ', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', (global as any).signup())
    .send({ orderId: new Types.ObjectId().toHexString(), token: '123' })
    .expect(404);
});
it('throws error if purchase order as a different user', async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments/')
    .set('Cookie', (global as any).signup())
    .send({ orderId: order.id, token: '213' })
    .expect(401);
});
it('throws error if purchase order that has been cancelled', async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  const res = await request(app)
    .post('/api/payments/')
    .set('Cookie', (global as any).signup(order.userId))
    .send({ orderId: order.id, token: '213' })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments/')
    .set('Cookie', (global as any).signup(order.userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  // expect(stripe.charges.create).toHaveBeenCalled();

  // expect((stripe.charges.create as jest.Mock).mock.calls[0][0].amount).toEqual(
  //   order.price * 100
  // );
});

it('returns a 204 with valid inputs and makes sure the charge was actually created by actual stripe', async () => {
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments/')
    .set('Cookie', (global as any).signup(order.userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  const stripeCharges = await stripe.charges.list({
    limit: 5,
  });

  const stripeCharge = stripeCharges.data.find((c) => c.amount === price * 100);

  // console.log({ stripeCharge });

  expect(stripeCharge).toBeDefined();

  // expect(stripe.charges.create).toHaveBeenCalled();

  // expect((stripe.charges.create as jest.Mock).mock.calls[0][0].amount).toEqual(
  //   order.price * 100
  // );
});

it('creates a payment record', async () => {
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments/')
    .set('Cookie', (global as any).signup(order.userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  const stripeCharges = await stripe.charges.list({
    limit: 5,
  });

  const stripeCharge = stripeCharges.data.find((c) => c.amount === price * 100);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge?.id,
  });

  // expect(payment).toBeDefined(); -> not good
  expect(payment).not.toBeNull();
});
