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
    tableName: 'ingredient',
    idAttribute: 'ingredientId',
    recipe: function (){
        return this.belongsTo(Recipes, 'recipeId')
    }
});

let PreparationSteps = bookshelf.Model.extend({
    tableName: 'preparation_step',
    idAttribute: 'preparationStepId',
    recipe: function (){
        return this.belongsTo(Recipes, 'recipeId')
    }
});

let Recipes = bookshelf.Model.extend({
    tableName: 'recipe',
    idAttribute: 'recipeId',
    user: function (){
        return this.belongsTo(Users, 'userId')
    },
    ingredients: function() {
        return this.hasMany(Ingredients, 'recipeId');
    },
    preparationSteps: function() {
        return this.hasMany(PreparationSteps, 'recipeId');
    }
});


module.exports = {Tokens, Users, Pictures, Recipes, Ingredients, PreparationSteps};