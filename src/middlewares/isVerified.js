import { checkIfVerified } from '../services/userService';

export async function isVerified(req, res, next) {
  try {
    const userIdentity = req.body.user_identity;
    const isVerified = await checkIfVerified(userIdentity);

    req.isVerified = isVerified;

    next();
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
}
