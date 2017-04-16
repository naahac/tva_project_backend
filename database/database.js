let knex = require('knex')(require('../knexfile').development);
let bookshelf = require('bookshelf')(knex);

let Tokens = bookshelf.Model.extend({
    tableName: 'token',
	idAttribute: 'tokenId',
    user: function (){
        return this.belongsTo(Users, 'userId')
    }
});

let Users = bookshelf.Model.extend({
    tableName: 'user',
    idAttribute: 'userId',
    token: function() {
        return this.hasMany(Tokens, 'userId');
    }
});


module.exports = {Tokens, Users};