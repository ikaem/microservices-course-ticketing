import { Router } from 'express';
import { deleteOrderRouter } from './delete';
import { newOrderRouter } from './new';
import { ordersRouter } from './orders';
import { showOrderRouter } from './show';

const router = Router();

router.use(ordersRouter);
router.use(newOrderRouter);
router.use(showOrderRouter);
router.use(deleteOrderRouter);

export { router };
