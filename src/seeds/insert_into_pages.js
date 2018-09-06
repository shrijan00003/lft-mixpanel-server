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
            path: '/gallery',

            referrer: 'https://www.facebook.com/',
            search: 'home',
            title: 'Gallery',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 3,
            path: '/home',

            referrer: 'https://www.google.com/',
            search: 'howto',
            title: 'Login',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 3,
            path: '/home',

            referrer: 'https://www.facebook.com/',
            search: 'Myapp',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 3,
            path: '/gallery',

            referrer: 'https://www.twitter.com/',
            search: 'home',
            title: 'Gallery',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 10,
            path: '/signup',

            referrer: 'https://www.facebook.com/',
            search: 'home',
            title: 'Signup',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 10,
            path: '/home',

            referrer: 'https://www.facebook.com/',
            search: 'howto',
            title: 'Home',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 10,
            path: '/blog',

            referrer: 'https://www.google.com/',
            search: 'Myapp',
            title: 'Blog',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 10,
            path: '/home',

            referrer: 'https://www.instagram.com/',
            search: 'home',
            title: 'Home',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 15,
            path: '/blog',

            referrer: 'https://www.facebook.com/',
            search: 'home',
            title: 'Blog',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Login',
            metadata_id: 15,
            path: '/home',

            referrer: 'https://www.google.com/',
            search: 'howto',
            title: 'Home',

            url: 'www.myurl.com/login',
          },
          {
            updated_at: new Date(),
            name: 'Myapp',
            metadata_id: 15,
            path: '/blog',

            referrer: 'https://www.facebook.com/',
            search: 'Myapp',
            title: 'Blog',

            url: 'www.myurl.com',
          },
          {
            updated_at: new Date(),
            name: 'Home',
            metadata_id: 15,
            path: '/login',

            referrer: 'https://www.facebook.com/',
            search: 'home',
            title: 'Login',

            url: 'www.myurl.com',
          },
        ]),
      ]);
    });
}
