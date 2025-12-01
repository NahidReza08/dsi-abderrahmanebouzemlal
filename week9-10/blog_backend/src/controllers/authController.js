import { User } from '../models/usersDB.js';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { hashPassword, isValidatedPassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

export const register = async (req, res) => {
	try {
		const { username, email, password, firstName, lastName } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }]
		}).exec();

		if (existingUser) {
			return res.status(409).json({
				error: 'User with this email or username already exists'
			});
		}

		const hashedPassword = await hashPassword(password);

		// Create user object with proper fields
		const user = new User({
			username,
			email,
			password: hashedPassword,
			firstName,
			lastName,
			createdAt: new Date()
		});

		const accessToken = await generateToken({
			id: user._id,
			email: user.email,
			username: user.username
		});

		const refreshToken = await generateToken(
			{
				id: user._id,
				email: user.email,
				username: user.username
			},
			true
		);

		// Save refresh token to user
		user.refreshToken = refreshToken;
		await user.save();

		// Set refresh token as HTTP-only cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});

		return res.status(201).json({
			message: 'User created successfully',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				createdAt: user.createdAt
			},
			accessToken
		});
	} catch (error) {
		console.log('Registration error:', error);
		res.status(500).json({ error: 'Failed to create user' });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const isValidPassword = await isValidatedPassword(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const accessToken = await generateToken({
			id: user._id,
			email: user.email,
			username: user.username
		});

		const refreshToken = await generateToken(
			{
				id: user._id,
				email: user.email,
				username: user.username
			},
			true
		);

		// Update refresh token in database
		user.refreshToken = refreshToken;
		await user.save();

		// Set refresh token as HTTP-only cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (much longer than 1 hour)
		});

		res.status(200).json({
			message: 'Login successful',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				createdAt: user.createdAt
			},
			accessToken
		});
	} catch (error) {
		console.log('Login error:', error);
		res.status(500).json({ error: 'Failed to login user' });
	}
};

export const refreshController = async (req, res) => {
	try {
		// Get token from cookie
		const token = req.cookies?.refreshToken;

		if (!token) {
			return res.status(401).json({ error: 'No refresh token provided' });
		}

		// Verify the refresh token
		const payload = await verifyToken(token);

		// Find user by ID from token and check if refresh token matches
		const user = await User.findOne({
			_id: payload.id,
			refreshToken: token
		}).exec();

		if (!user) {
			return res.status(403).json({ error: 'Invalid refresh token' });
		}

		// Generate new access token
		const accessToken = await generateToken({
			id: user._id,
			email: user.email,
			username: user.username
		});

		res.status(200).json({
			accessToken,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			}
		});
	} catch (error) {
		console.log('Token refresh error:', error);
		res.status(403).json({ error: 'Invalid or expired token' });
	}
};

export const logout = async (req, res) => {
	try {
		const token = req.cookies?.refreshToken;

		if (token) {
			// Find user and clear refresh token
			const user = await User.findOne({ refreshToken: token }).exec();
			if (user) {
				user.refreshToken = null;
				await user.save();
			}
		}

		// Clear the cookie
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		res.status(200).json({ message: 'Successfully logged out' });
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({ error: 'Logout failed' });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email }).exec();

		if (!user) {
			// Don't reveal whether user exists or not
			return res.status(200).json({
				message: 'If an account with that email exists, a reset link has been sent.'
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');

		// Hash the token and set expiry (15 minutes)
		user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
		user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

		await user.save();

		// Create reset URL (point to your frontend)
		const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

		// Configure email transporter
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		});

		const message = `
      You requested a password reset for your account.
      
      Please click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 15 minutes.
      
      If you didn't request this, please ignore this email.
    `;

		await transporter.sendMail({
			from: process.env.EMAIL_FROM || `"Auth System" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: 'Password Reset Request',
			text: message,
			html: `
        <p>You requested a password reset for your account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
		});

		res.status(200).json({
			message: 'If an account with that email exists, a reset link has been sent.'
		});
	} catch (error) {
		console.error('Forgot password error:', error);

		// Reset token and expiry on error
		if (req.body.email) {
			const user = await User.findOne({ email: req.body.email }).exec();
			if (user) {
				user.resetPasswordToken = undefined;
				user.resetPasswordExpire = undefined;
				await user.save();
			}
		}

		res.status(500).json({ message: 'Error sending reset email' });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!password) {
			return res.status(400).json({ message: 'Password is required' });
		}

		// Hash the token to compare with stored hash
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpire: { $gt: Date.now() }
		}).exec();

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired reset token' });
		}

		// Update password and clear reset token fields
		user.password = await hashPassword(password);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		res.status(200).json({ message: 'Password reset successful' });
	} catch (error) {
		console.error('Reset password error:', error);
		res.status(500).json({ message: 'Error resetting password' });
	}
};

export const profile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).exec();
		res.json(user);
	} catch (error) {
		console.error('Profile error:', error);
		res.status(500).json({ error: 'Failed to fetch profile' });
	}
};
