import { Router } from 'express';
import requestIp from 'request-ip';
import { authenticate } from '../middlewares/auth';
import * as AuthService from '../services/authService';

const router = Router();

router.post('/login', async (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);

  try {
    const response = await AuthService.loginUser(req.body, clientIp);
    res.status(200).json(response);
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

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
