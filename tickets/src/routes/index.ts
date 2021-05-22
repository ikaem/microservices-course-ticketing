import express from 'express';
import { createTicketRouter } from './new';
import { showRouter } from './show';
import { indexRouter } from './tickets';
import { UpdateRouter } from './update';

const router = express.Router();

router.use(createTicketRouter);
router.use(showRouter);
router.use(indexRouter);
router.use(UpdateRouter);

export { router };
