import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@angrychaired/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = Router();

router.post(
  '/api/payments',
  currentUser,
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('orderId').notEmpty().withMessage('Order id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    console.log({ order });

    if (!order) throw new NotFoundError();

    console.log({});

    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('This order has already been cancelled');

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: charge.id,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createPaymentRouter };
