/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('events', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.integer('created_by');
    table.timestamp('deleted_at');
    table.integer('deleted_by');
    table.string('client_id');
    table.string('event_name');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('events');
}
