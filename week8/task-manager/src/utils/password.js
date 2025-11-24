import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const isValidatedPassword = async (data, hash) => {
  return await bcrypt.compare(data, hash);
};
