/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.alterTable('users', table => {
    table.string('email');
    table.string('password');
    table.string('refresh_token',1000).defaultTo(null);
    table.timestamp('deleted_at');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('email');
    table.dropColumn('password');
    table.dropColumn('refresh_token');
    table.dropColumn('deleted_at');
  });
}
