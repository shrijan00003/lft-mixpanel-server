/**
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  // Deletes all existing entries
  return knex('client_user_details')
    .del()
    .then(() => {
      // Inserts seed entries
      return Promise.all([
        knex('client_user_details').insert([
          {
            updated_at: new Date(),
            client_id: 'abc123',
            domain_name: 'www.abc.com',
            company_name: 'hello world',
            user_id: 1,
          },
          {
            updated_at: new Date(),
            client_id: 'abc1234',
            domain_name: 'www.xyz.com',
            company_name: 'hello Nepal',
            user_id: 2,
          },
        ]),
      ]);
    });
}
