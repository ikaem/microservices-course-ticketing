import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@angrychaired/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatePublisher } from '../events/publishers/ticket-updated-publisher';

import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    await new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as UpdateRouter };
