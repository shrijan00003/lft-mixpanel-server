import { Router } from 'express';
import * as todoService from '../services/todoService';
import { authenticate } from '../middlewares/auth';

const router = Router();
/**
 * findTodo
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description FINDING TODO FROM TODO SERVICES
 */
function findTodo(req, res, next) {
  return todoService
    .getTodo(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * GET /api/todos
 */
router.get('/', (req, res, next) => {
  todoService
    .handleQuery(req.query)
    .then(data => res.json({ data }))
    .catch(err => next(err));
  // if(req.query.cat_id){
  //   todoService
  //   .getFilteredByCategoryId(req.query.cat_id)
  //   .then(data => res.json({ data }))
  //   .catch(err => next(err));
  // }else if(req.query.title){
  //   todoService
  //   .getFilteredByTitle(req.query.title)
  //   .then(data => res.json({ data } ))
  //   .catch(err => next(err));
  // }else if(req.query.sortBy){
  //   todoService
  //   .getSortedTodos(req.query.type, req.query.sortBy)
  //   .then(data => res.json({ data }))
  //   .catch(err => next(err));
  // }else if(req.query.page){
  //   todoService
  //   .getOffsetPages(req.query.page, req.query.perpage)
  //   .then(data => res.json({ data }))
  //   .catch(err => next(err));
  // }
  // else{
  //   todoService
  //     .getAllTodos(req.userId)
  //     .then(data => res.json({ data }))
  //     .catch(err => next(err));
  // }
});

/**
 * GET /api/todos/:id
 */
router.get('/:id', authenticate, (req, res, next) => {
  todoService
    .getTodo(req.params.id, req.userId)
    .then(data => {
      return res.json({ data });
    })
    .catch(err => res.json({ msg: 'error in todoservice' + err }));
  // .catch(err => next(err));
});

/**
 * POST /api/todos
 */
router.post('/', authenticate, (req, res, next) => {
  todoService
    .createTodo(req.body, req.userId)
    .then(data => res.status(200).json({ data }))
    .catch(err => next(err));
});

/**
 * PUT /api/todos/:id
 */
router.put('/:id', authenticate, findTodo, (req, res, next) => {
  todoService
    .updateTodo(req.params.id, req.body, req.userId)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * DELETE /api/todos/:id
 */
router.delete('/:id', authenticate, findTodo, (req, res, next) => {
  todoService
    .deleteTodo(req.params.id, req.userId)
    .then(data => res.status(200).json({ data }))
    .catch(err => next(err));
});

export default router;
