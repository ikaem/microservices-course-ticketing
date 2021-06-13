import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  requireAuth,
} from '@angrychaired/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) throw new BadRequestError('No such order');
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
    res.send(order);
  }
);

export { router as showOrderRouter };
