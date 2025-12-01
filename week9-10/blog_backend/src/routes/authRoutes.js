import Router from 'express';
import {
	register,
	login,
	refreshController,
	logout,
	resetPassword,
	forgotPassword,
	profile
} from '../controllers/authController.js';
import {
	validateUserRegistration,
	validateUserLogin,
	validateUserReset
} from '../middlewares/validate.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = new Router();

router.post('/signup', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh', refreshController);
router.post('/logout', authenticateToken, logout);
router.post('/forgotPassword', validateUserReset, forgotPassword);
router.post('/resetPassword/:token', resetPassword);
router.get('/me', authenticateToken, profile);

export default router;
