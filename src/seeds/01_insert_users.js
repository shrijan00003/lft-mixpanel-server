import bcrypt from 'bcrypt';
import { SALT_WORK_FACTOR } from '../constants/auth';

const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
/**
 * Seed users table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export async function seed(knex, Promise) {
  const password = await bcrypt.hash('password', salt);

  return knex('users')
    .del()
    .then(() => {
      return Promise.all([
        knex('users').insert([
          {
            updated_at: new Date(),
            updated_by: '1',
            deleted_at: null,
            deleted_by: null,
            user_name: 'Shrijan Tripathi',
            user_email: 'shrijan00003@gmail.com',
            user_type: 1,
            password: password,
            refresh_token: null,
            is_active: '1',
          },
          {
            updated_at: new Date(),
            updated_by: '1',
            deleted_at: null,
            deleted_by: null,
            user_name: 'Akasky Rai',
            user_email: 'akasky72@gmail.com',
            user_type: 1,
            password: password,
            refresh_token: null,
            is_active: '1',
          },
          {
            updated_at: new Date(),
            updated_by: '1',
            deleted_at: null,
            deleted_by: null,
            user_name: 'Ankita Sharma',
            user_email: 'ankita@gmail.com',
            user_type: 1,
            password: password,
            refresh_token: null,
            is_active: '1',
          },
        ]),
      ]);
    });
}
