import express, { Request, Response } from 'express';
import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@angrychaired/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket that the user is trying to order
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();

    if (isReserved) throw new BadRequestError('The ticket is already reserved');

    // calculate expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order, save to database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    order.save();

    // tell the app that the order has been created - send event
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
