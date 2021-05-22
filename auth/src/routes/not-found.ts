import express, { NextFunction } from 'express';
import { NotFoundError } from '@angrychaired/common';

const router = express.Router();

router.all('*', async (_req, _res, next: NextFunction) => {
  throw new NotFoundError();
});

export { router as notFoundRouter };
