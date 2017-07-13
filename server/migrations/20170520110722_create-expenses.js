exports.up = function(knex, Promise) {

  return knex.schema.createTable('hw_values', function (table) {
    table.increments()
    table.string('name')
    table.bigInteger('value')
    table.date('date')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('hw_values');
};