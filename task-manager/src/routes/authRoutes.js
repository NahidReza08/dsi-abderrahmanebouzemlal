import { Router } from 'express';
import {
  register,
  login,
  refreshController,
  logout,
  resetPassword,
  forgotPassword
} from '../controlers/authController.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserReset
} from '../middlewares/validate.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = new Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh', refreshController);
router.post('/logout', authenticateToken, logout);
router.post('/forgotPassowrd', validateUserReset, forgotPassword);
router.post('/resetPassowrd/:token', resetPassword);

export default router;
