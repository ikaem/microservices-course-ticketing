import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@angrychaired/common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import { Order } from '../models/order';

import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  [
    param('orderId')
      .notEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    console.log('order ID', orderId);

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      // TODO version added here later
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as deleteOrderRouter };
