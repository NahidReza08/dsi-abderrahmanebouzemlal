import { verifyToken } from '../utils/jwt.js';
import { APIError } from './error.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new APIError('No token', 'UnauthenticatedError', 401);
    }
    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    console.log(e);
    next(new APIError('invalid token', 'UnauthenticatedError', 403));
  }
};
