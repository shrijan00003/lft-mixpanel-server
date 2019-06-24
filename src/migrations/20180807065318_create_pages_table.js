/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('pages', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNull();
    table
      .integer('metadata_id')
      .references('id')
      .inTable('event_metadata');
    table.string('name');
    table.string('path');
    table.string('referrer');
    table.string('search');
    table.string('title');
    table.string('url');
    table.string('keywords');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('pages');
}
