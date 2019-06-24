/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('user_login_details', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNull();
    table.string('location');
    table.string('browser');
    table.string('device');
    table.string('os');
    table.string('ip_address');
    table.string('details');
    table.string('status');
    table
      .integer('user_id')
      .references('id')
      .inTable('users');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('user_login_details');
}
