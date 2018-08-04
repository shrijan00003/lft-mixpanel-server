import { Router } from 'express';
import * as AuthService from '../services/authService';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const response = await AuthService.loginUser(req.body);
    if (response.error) {
      res.status(403).json(response);
    } else {
      res.status(200).json(response);
    }
  } catch (err) {
    next(err);
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
  const refreshToken = req.body.refreshToken;
  console.log(userId, refreshToken);
  try {
    const response = await AuthService.logout(userId, refreshToken);
    console.log('response here', response);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(400).json({
        message: 'Not logged out',
      });
    }
  } catch (err) {
    console.log(err);
  }
});
export default router;
