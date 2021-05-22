import {
  currentUser,
  requireAuth,
  validateRequest,
} from '@angrychaired/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  currentUser,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({
        gt: 0,
      })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    console.log('title in the create ticket route', title);

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser?.id as string,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
