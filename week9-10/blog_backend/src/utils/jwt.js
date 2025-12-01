import { jwtVerify, SignJWT } from 'jose';
import { createSecretKey } from 'node:crypto';

export const generateToken = (payload, refresh = false) => {
	const secret = process.env.JWT_SECRET;
	const secretKey = createSecretKey(secret, 'utf-8');
	const expires = refresh
		? process.env.JWT_REFRESH_EXPIRES_IN || '30m'
		: process.env.JWT_EXPIRES_IN || '7d';

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expires)
		.sign(secretKey);
};

export const verifyToken = async (token) => {
	const secretKey = createSecretKey(process.env.JWT_SECRET, 'utf-8');
	const { payload } = await jwtVerify(token, secretKey);
	return payload;
};
