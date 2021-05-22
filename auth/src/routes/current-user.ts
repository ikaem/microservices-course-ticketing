// auth\src\routes\current-user.ts
import express from 'express';
// import { currentUser } from '/middlewares/current-user';
import { currentUser } from '@angrychaired/common';
// import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  // requireAuth,
  async (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
