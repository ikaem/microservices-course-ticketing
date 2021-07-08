import { Router } from 'express';

import { createPaymentRouter } from './new';

const router = Router();

router.use(createPaymentRouter);

export { router };
