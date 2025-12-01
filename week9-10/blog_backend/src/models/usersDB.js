import mongoose from './connect.js';
import crypto from 'node:crypto';

export const UsersSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profile_picture: {
		type: String
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	last_login: Date,
	is_active: {
		type: Boolean,
		default: true
	},
	is_verified: {
		type: Boolean,
		default: false
	},
	refreshToken: String,
	resetPasswordToken: String,
	resetPasswordExpire: Date
});

UsersSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

	return resetToken;
};
export const User = mongoose.model('User', UsersSchema);
