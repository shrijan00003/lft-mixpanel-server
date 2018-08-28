/**
 * Seed users table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  return knex('tracks')
    .del()
    .then(() => {
      return Promise.all([
        knex('tracks').insert([
          {
            updated_at: new Date(),
            event_name: 'Clicked Register',
            metadata_id: 3,
            payload: { user: 'user', change: 'created account' },
          },
          {
            updated_at: new Date(),
            event_name: 'Clicked Login',
            metadata_id: 3,
            payload: { user: 'user', change: 'logged in' },
          },
          {
            updated_at: new Date(),
            event_name: 'Clicked Message',
            metadata_id: 3,
            payload: { user: 'user', change: 'messenger' },
          },
          {
            updated_at: new Date(),
            event_name: 'Clicked Profile',
            metadata_id: 3,
            payload: { user: 'user', change: 'changed profile' },
          },
        ]),
      ]);
    });
}
