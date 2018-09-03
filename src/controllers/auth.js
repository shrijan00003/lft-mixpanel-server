import { Router } from 'express';
import requestIp from 'request-ip';
import { authenticate } from '../middlewares/auth';
import * as AuthService from '../services/authService';
import { countLoginAttempts } from '../services/loginDetailsService';
import { isVerified } from '../middlewares/isVerified';

const router = Router();

/**
 *
 * POST / login user
 */
router.post('/login', isVerified, async (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);

  try {
    const response = await AuthService.loginUser(req.body, clientIp);
    res.status(200).json(response);
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 *
 * POST / login attempt count
 */
router.post('/logincount', async (req, res, next) => {
  const userData = {
    userIdentity: req.body.user_identity,
  };

  try {
    const response = await countLoginAttempts(userData);
    if (parseInt(response.attributes.count) >= 5) {
      throw {
        status: 403,
        statusMessage: 'Slow down, your account has been disabled due to frequent login attempt.',
      };
    }
    res.json(true);
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 *
 * POST / refresh user
 */
router.post('/refresh', async (req, res, next) => {
  const userId = req.body.user_id;
  const refreshToken = req.body.refresh_token;
  try {
    const response = await AuthService.refresh(userId, refreshToken);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'User Not found' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 *
 * POST / logout
 */
router.post('/logout', authenticate, async (req, res, next) => {
  const userId = req.userId;
  const refreshToken = req.body.refresh_token;
  try {
    const response = await AuthService.logout(userId, refreshToken);
    res.status(200).json(response.message);
  } catch (err) {
    res.status(err.status).json(err.message);
  }
});

export default router;
