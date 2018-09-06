import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import * as clientDetailService from '../services/clientDetailService';
import { findUser, userValidator } from '../validators/userValidator';
import { authenticate } from '../middlewares/auth';
import * as MAIL from '../services/mailServices';

const router = Router();

/**
 *
 */
router.get('/verifyEmail', async (req, res, next) => {
  try {
    const emailToken = req.query.token;
    if (emailToken) {
      const response = await MAIL.verifyEmail(emailToken);
      console.log('response from email token', response);
      const { userId, userEmail } = response;

      console.log('useremail', userEmail);

      if (userEmail) {
        const activatedUser = await userService.activateUser(userId, userEmail);
        if (activatedUser) {
          res.redirect('http://localhost:3000/login');
        } else {
          res.redirect('http://localhost:3000/signup');
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * GET /api/users/ to check if username or email already exist
 */
router.get('/check', (req, res, next) => {
  userService
    .checkUsers(req.query)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * GET /api/users/profile to get profile of the user with client details
 */
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const userProfile = await userService.getUserProfile(req.userId);
    if (userProfile) {
      res.status(200).json({
        userProfile,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.message);
  }
});

/**
 * PUT /api/users/profile with the access token in the header
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const userProfile = await userService.updateProfile(req.userId, req.body);
    res.status(200).json({
      message: 'User and Client Both are Updated',
      userProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.message);
  }
});

/**
 * GET /api/users
 */
router.get('/', (req, res, next) => {
  userService
    .getAllUsers()
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * GET /api/users/:id
 */
router.get('/:id', (req, res, next) => {
  userService
    .getUser(req.params.id)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * POST /api/users
 * FOR EMAIL VERIFICATION
 */
router.post('/client', userValidator, async (req, res, next) => {
  try {
    let message = undefined;
    const userResponse = await userService.createUser(req.body);
    const email = req.body.user_email;

    if (userResponse) {
      const userId = userResponse.id;
      const clientResponse = await clientDetailService.createClientDetails(userId, req.body);
      if (clientResponse) {
        const emailResponse = MAIL.sendEmail(userId, email);
        if (emailResponse) {
          message = `email is sent to ${email}`;
        } else {
          throw {
            status: 403,
            statusMessage: `message cannot sent to ${email}`,
          };
        }
        res.status(HttpStatus.CREATED).json({
          userResponse,
          clientResponse,
          message,
        });
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * PUT /api/users/:id
 */
router.put('/:id', findUser, userValidator, (req, res, next) => {
  userService
    .updateUser(req.params.id, req.body)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * DELETE /api/users/:id
 */
router.delete('/:id', authenticate, findUser, (req, res, next) => {
  userService
    .deleteUser(req.params.id)
    .then(data => res.status(200).json({ data }))
    .catch(err => next(err));
});

export default router;
