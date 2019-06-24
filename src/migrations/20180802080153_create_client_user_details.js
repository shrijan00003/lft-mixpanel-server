/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('client_user_details', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNull();
    table
      .string('client_id')
      .unique()
      .notNull();
    table.string('domain_name').notNull();
    table.string('company_name').notNull();
    table
      .string('plan')
      .notNull()
      .defaultTo('free');
    table.string('description');
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
  return knex.schema.dropTable('client_user_details');
}
