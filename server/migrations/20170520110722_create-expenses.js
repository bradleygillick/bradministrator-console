exports.up = function(knex, Promise) {

  return knex.schema.createTable('expenses', function (table) {
    table.increments()
    table.string('category')
    table.decimal('amount')
    table.date('expDate')
    table.string('bizName')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('expenses');
};