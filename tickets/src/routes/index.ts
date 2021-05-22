import express from 'express';
import { createTicketRouter } from './new';

const router = express.Router();

router.use(createTicketRouter);

export { router };
