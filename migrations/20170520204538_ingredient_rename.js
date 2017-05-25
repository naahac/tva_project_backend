
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('ingredient')
      .createTable('ingredient', (table) => {
      table.increments('ingredientId').primary();
      table.string('amount');
      table.string('name');
      table.integer('recipeId')
          .references('recipeId').inTable('recipe');
  })
};

exports.down = function(knex, Promise) {
  
};
