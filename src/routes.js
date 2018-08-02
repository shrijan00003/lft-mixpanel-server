import { Router } from 'express';
import swaggerSpec from './utils/swagger';

import usersController from './controllers/users';
import todosController from './controllers/todos';
import categoriesController from './controllers/categories';
import registerController from './controllers/register';
import authController from './controllers/auth';

/**
 * Contains all API routes for the application.
 */
let router = Router();

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

/**
 * @swagger
 * definitions:
 *   App:
 *     title: App
 *     type: object
 *     properties:
 *       app:
 *         type: string
 *       apiVersion:
 *         type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API version
 *     description: App version
 *     produces:
 *       - application/json
 *     tags:
 *       - Base
 *     responses:
 *       200:
 *         description: Application and API version
 *         schema:
 *           title: Users
 *           type: object
 *           $ref: '#/definitions/App'
 */
router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version,
  });
});

router.use('/users', usersController);

/**
 * Router for todos
 */
router.use('/todos', todosController);

/**
 * Router for categories
 */
router.use('/categories', categoriesController);

// route for register
router.use('/register', registerController);

router.use('/auth', authController);

export default router;
