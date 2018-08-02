/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.alterTable('todos', table => {
    table.boolean('is_finished', false);
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.alterTable('todos', table => {
    table.dropColumn('is_finished');
  });
}
