import express from 'express';
import { createTicketRouter } from './new';
import { showRouter } from './show';

const router = express.Router();

router.use(createTicketRouter);
router.use(showRouter);

export { router };
