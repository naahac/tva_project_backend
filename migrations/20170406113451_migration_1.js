
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
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('user')
        .dropTable('token');
};
