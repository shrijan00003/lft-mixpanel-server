import { Router } from 'express';
import * as categoryService from '../services/categoryService';

const router = Router();
/**
 * find category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description FINDING TODO FROM CATEGORIES SERVICES
 */

function findCategory(req, res, next) {
  return categoryService
    .getCategory(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * GET /api/categories
 */
router.get('/', (req, res, next) => {
  categoryService
    .getAllCategories()
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * GET /api/categories/:id
 */
router.get('/:id', (req, res, next) => {
  categoryService
    .getCategory(req.params.id)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * POST /api/categories
 */
router.post('/', (req, res, next) => {
  categoryService
    .createCategory(req.body)
    .then(data => res.status(200).json({ data }))
    .catch(err => next(err));
});

/**
 * PUT /api/categories/:id
 */
router.put('/:id', findCategory, (req, res, next) => {
  categoryService
    .updateCategory(req.params.id, req.body)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * DELETE /api/categories/:id
 */
router.delete('/:id', findCategory, (req, res, next) => {
  categoryService
    .deleteCategory(req.params.id)
    .then(data => res.status(200).json({ data }))
    .catch(err => next(err));
});

export default router;
