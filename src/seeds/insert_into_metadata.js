/**
 * Seed users table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  return knex('event_metadata')
    .del()
    .then(() => {
      return Promise.all([
        knex('event_metadata').insert([
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'chrome',
            os: 'android',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1980x1020',
            location: {
              latitude: 37.0902,
              longitude: 95.7129,
              countryName: 'United States',
            },
          },
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'chrome',
            os: 'ios',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1366x768',
            location: {
              latitude: 47.6062,
              longitude: 122.3321,
              countryName: 'United States',
            },
          },

          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'firefox',
            os: 'linux',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1980x1020',
            location: {
              latitude: 37.0902,
              longitude: 95.7129,
              countryName: 'United States',
            },
          },
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'firefox',
            os: 'linux',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1366x768',
            location: {
              latitude: 30.9843,
              longitude: 91.9623,
              countryName: 'United States',
            },
          },
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'safari',
            os: 'ios',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1980x1020',
            location: {
              latitude: 61.524,
              longitude: 105.3188,
              countryName: 'Russian Federation',
            },
          },
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'opera',
            os: 'windows',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1980x1020',
            location: {
              latitude: 55.7558,
              longitude: 37.6173,
              countryName: 'Russian Federation',
            },
          },
          {
            updated_at: new Date(),
            client_id: 'abc123',
            browser: 'edge',
            os: 'android',
            user_id: 3,
            user_name: 'ankita',
            user_email: 'ankita@gmail.com',
            ip_address: '192.168.1.1',
            user_info: { name: 'ankita', address: 'kalanki' },
            device: '1980x1020',
            location: {
              latitude: 46.2276,
              longitude: 2.2137,
              countryName: 'France',
            },
          },
        ]),
      ]);
    });
}
