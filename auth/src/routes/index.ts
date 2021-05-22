import { Router } from 'express';

import { currentUserRouter } from './current-user';
import { notFoundRouter } from './not-found';
import { signinRouter } from './signin';
import { signoutRouter } from './signout';
import { signupRouter } from './signup';

const router = Router();

router.use(currentUserRouter);
router.use(signinRouter);
router.use(signoutRouter);
router.use(signupRouter);
router.use(notFoundRouter);

export { router };
