import { User } from '../models/userDB.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { hashPassword, isValidatedPassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { env } from 'process';

export const register = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const user = {
      ...req.body,
      password: hashedPassword
    };
    const accessToken = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    });
    const refreshToken = await generateToken(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      true
    );
    await User.insertOne({ ...user, refreshToken });
    return res.status(201).json({
      message: 'New user created',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastname: user.lastName,
        createdAt: user.createdAt
      },
      accessToken
    });
  } catch (error) {
    console.log('registeration error', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await isValidatedPassword(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    });
    const refreshToken = await generateToken(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      true
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000
    });
    res.status(200).json({
      message: 'Login successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastname: user.lastName,
        createdAt: user.createdAt
      },
      accessToken
    });
  } catch (error) {
    console.log('login error', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
};

export const refreshController = async (req, res) => {
  try {
    const token = req.get('cookie').split('=')[1];

    if (!token) {
      res.status(401).json({ error: 'No token' });
    }
    const payload = await verifyToken(token);
    const accessToken = await generateToken({
      id: payload.id,
      email: payload.email,
      username: payload.username
    });
    res.status(200).json({ accessToken });
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: 'invalid token', details: e });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    req.user = null;

    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: 'Logout failed' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassowrd/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const message = `You requested a password reset.\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nThis link expires in 15 minutes.`;

    await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER || 'The Admin Abderrahmane'}>`,
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    });

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset email.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log(token);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear reset fields
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
