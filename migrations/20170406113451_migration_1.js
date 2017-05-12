
exports.up = function(knex, Promise) {

    return knex.schema.createTable('user',(table) => {
        table.increments('userId').primary();
        table.string('username');
        table.string('password');
        table.string('email');
        table.string('name');
        table.string('surname');
    }).createTable('token', (table) => {
        table.string('tokenId').primary();
        table.date('createDate');
        table.date('validToDate');
        table.bool('active');
        table.integer('userId')
            .references('userId').inTable('user');
    }).createTable('picture', (table) => {
        table.increments('pictureId').primary();
        table.string('data', 1000000000);//max length 1 billion
    }).createTable('recipe', (table) => {
        table.increments('recipeId').primary();
        table.string('title');
        table.string('description');
        table.boolean('public');
        table.integer('userId')
            .references('userId').inTable('user');
        table.integer('pictureId')
            .references('pictureId').inTable('picture');
    }).createTable('ingredient', (table) => {
        table.increments('ingredientId').primary();
        table.integer('count');
        table.string('name');
        table.integer('recipeId')
            .references('recipeId').inTable('recipe');
    }).createTable('preparation_step', (table) => {
        table.increments('preparationStepId').primary();
        table.string('Description');
        table.integer('recipeId')
            .references('recipeId').inTable('recipe');
    });
};

exports.down = function(knex, Promise) {

    return knex.schema
        .dropTable('user')
        .dropTable('token')
        .dropTable('picture')
        .dropTable('recipe')
        .dropTable('ingredient')
        .dropTable('preparation_step');
};
