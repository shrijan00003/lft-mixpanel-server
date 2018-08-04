import Joi from 'joi';
import validate from '../utils/validate';
import * as userService from '../services/userService';

const SCHEMA = {
  user_name: Joi.string()
    .label('Name')
    .max(90)
    .required(),
  user_email: Joi.string()
    .label('Email')
    .max(255)
    .required(),
  password: Joi.string()
    .label('Password')
    .max(1000)
    .required(),
  domain_name: Joi.string()
    .label('Domain Name')
    .max(1000),
};

/**
 * Validate create/update user request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function userValidator(req, res, next) {
  return validate(req.body, SCHEMA)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Validate users existence.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function findUser(req, res, next) {
  return userService
    .getUser(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

export { findUser, userValidator };
