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
            domain_name: 'www.shrijantripathi.com.np',
            company_name: 'hello world',
            user_id: 1,
          },
          {
            updated_at: new Date(),
            client_id: 'abc1234',
            domain_name: 'www.akasy.com',
            company_name: 'Akasy world',
            user_id: 2,
          },
          {
            updated_at: new Date(),
            client_id: 'abc12345',
            domain_name: 'www.ankita.com',
            company_name: 'Ankita Construction',
            user_id: 3,
          },
        ]),
      ]);
    });
}
