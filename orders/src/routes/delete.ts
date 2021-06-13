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

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  }
);

export { router as deleteOrderRouter };
