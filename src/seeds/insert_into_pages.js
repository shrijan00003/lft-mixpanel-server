/**
 * Seed users table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  return knex('pages')
    .del()
    .then(() => {
      return Promise.all([
        knex('pages').insert([
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 3,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 3,
            path: '/home',

            referrer: '/home',
            search: 'howto',
            title: 'Login',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 3,
            path: '/',

            referrer: '/home',
            search: 'Myapp',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 3,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 10,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 10,
            path: '/home',

            referrer: '/home',
            search: 'howto',
            title: 'Login',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 10,
            path: '/',

            referrer: '/home',
            search: 'Myapp',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 10,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 15,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 15,
            path: '/home',

            referrer: '/home',
            search: 'howto',
            title: 'Login',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 15,
            path: '/',

            referrer: '/home',
            search: 'Myapp',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 15,
            path: '/',

            referrer: '/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
        ]),
      ]);
    });
}
