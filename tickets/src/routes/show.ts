import { NotFoundError } from '@angrychaired/common';
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';

import { Ticket } from '../models/ticket';

const router = Router();

router.get(
  '/api/tickets/:id',
  [param('id').not().isEmpty().withMessage('Ticket id is required')],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // ticket can be null or the ticket
    if (!ticket) throw new NotFoundError();

    res.status(200).send(ticket);
  }
);

export { router as showRouter };
