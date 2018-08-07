import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SALT_WORK_FACTOR } from '../constants/auth';
import uid from 'uuid/v1';

const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
// const salt = "123";

export async function getHash(pass) {
  const hashedOne = await bcrypt.hashSync(pass, salt);

  return hashedOne;
}

export async function verifyUser(password, user) {
  const dbPass = user.attributes.password;
  const match = await bcrypt.compareSync(password, dbPass);

  return match;
}

export function createAccessToken(data) {
  return jwt.sign({ data }, process.env.ACCESS_TOKEN_CONST, {
    expiresIn: 60 * 60, // 1 hour
  });
}

export function createRefreshToken(data) {
  // return uid();
  return jwt.sign({ data }, process.env.REFRESH_TOKEN_CONST, {
    expiresIn: 60 * 60 * 24, // 1 DAY
  });
}

export function verifyAccessToken(token) {
  const res = jwt.verify(token, process.env.ACCESS_TOKEN_CONST);

  return res;
}

export const createClientId = () => {
  return uid();
};
