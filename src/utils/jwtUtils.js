import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SALT_WORK_FACTOR } from '../constants/auth';
import uid from 'uuid/v4';

const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
// const salt = "123";

export async function getHash(pass) {
  const hashedOne = await bcrypt.hash(pass, salt);

  return hashedOne;
}

export async function verifyUser(password, user) {
  const dbPass = user.attributes.password;
  const match = await bcrypt.compare(password, dbPass);

  return match;
}

export function createAccessToken(data) {
  return jwt.sign({ data }, process.env.ACCESS_TOKEN_CONST, {
    expiresIn: 60 * 1,
  });
}

export function createRefreshToken() {
  return uid();
}

export function verifyAccessToken(token) {
  const res = jwt.verify(token, process.env.ACCESS_TOKEN_CONST);

  return res;
}

export const createClientId = () => {
  return uid();
};
