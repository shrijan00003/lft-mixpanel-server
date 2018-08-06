/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNull();
    table.integer('updated_by');
    table.timestamp('deleted_at');
    table.integer('deleted_by');
    table.string('user_name').notNull();
    table.string('user_email').notNull();
    table
      .string('user_type')
      .notNull()
      .defaultTo(1);
    table.string('password').notNull();
    table.string('refresh_token', 1000).defaultTo(null);
    table.boolean('is_active').defaultTo(true);
    table.string('image_url');
    table.integer('login_attempts');
    table.timestamp('login_attempt_date');
    table.string('location');
    table.string('browser');
    table.string('device');
    table.string('os');
    table.string('ip_address');
  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('users');
}
