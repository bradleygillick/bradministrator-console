exports.up = function(knex, Promise) {
  return knex.schema.createTable('expenses', function (table) {
    table.increments()
    table.string('category')
    table.decimal('amount')
  })
};

exports.down = function(knex, Promise) {

};