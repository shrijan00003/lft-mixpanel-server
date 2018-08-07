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
    table.string('first_name').notNull();
    table.string('last_name').notNull();
    table.string('gender');
    table.string('phone');
    table
      .string('user_name')
      .unique()
      .notNull();
    table
      .string('user_email')
      .unique()
      .notNull();
    table
      .string('user_type')
      .notNull()
      .defaultTo(1);
    table.string('image_url');
    table.string('password').notNull();
    table.string('refresh_token', 1000).defaultTo(null);
    table.boolean('is_active').defaultTo(true);
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
