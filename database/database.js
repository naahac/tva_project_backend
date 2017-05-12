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

let Pictures = bookshelf.Model.extend({
    tableName: 'picture',
    idAttribute: 'pictureId'
});

let Ingredients = bookshelf.Model.extend({
    tableName: 'ingredients',
    idAttribute: 'ingredientId'
});

let Recipes = bookshelf.Model.extend({
    tableName: 'recipe',
    idAttribute: 'recipeId'
});


module.exports = {Tokens, Users, Pictures, Recipes};