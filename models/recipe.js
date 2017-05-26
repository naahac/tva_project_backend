var db = require('../database/database');
var SearchRequest = require('../models/searchRequest');

class Recipe {
    constructor(recipeId, title, description, isPublic, userId, pictureId, preparationTime) {
        if (recipeId !== undefined && recipeId > 0)
            this.recipeId = recipeId;
        this.title = title;
        this.description = description;
        this.public = isPublic;
        this.userId = userId;
        this.preparationTime = preparationTime;
        if (pictureId !== undefined)
            this.pictureId = pictureId;
    }

    static getRecipesByUserId(userId, callback) {
        new db.Recipes()
            .where('userId', '=', userId)
            .fetchAll({withRelated: ['ingredients', 'preparationSteps']})
            .then((model) => {
                if (model === null)
                    callback({success: false});
                else
                    callback({success: true, data: model});
            });
    }

    static searchRecipe(data, callback) {
        var searchReques = new SearchRequest(data.token, data.recipeName, data.minPreparationSteps, data.maxPreparationSteps, data.minIngredients, data.maxIngredients, data.minPreparationTime, data.maxPreparationTime);
        new db.Recipes()
            .where('title', 'LIKE', '%' + searchReques.recipeName + '%')
            .where('preparationTime', '>', searchReques.minPreparationTime)
            .where('preparationTime', '<', searchReques.maxPreparationTime)
            .fetchAll({withRelated: ['ingredients', 'preparationSteps']})
            .then((model) => {
                if (model === null)
                    callback({success: false});
                else
                    callback({success: true, data: model});
            })
            .catch((error) => {
                console.log("error search");
                callback({success: false});
            });
    }

    static getRecipeById(recipeId, callback) {
        new db.Recipes({recipeId: recipeId})
            .fetch()
            .then((model) => {
                if (model === null)
                    callback({success: false});
                else
                    callback({success: true, data: model});
            });
    }

    static saveRecipe(recipeId, title, description, isPublic, userId, pictureId, preparationTime, callback) {
        let recipe = new Recipe(recipeId, title, description, isPublic, userId, pictureId, preparationTime);
        new db.Recipes(recipe)
            .save(null, {})
            .then((recipe) => {
                console.log("recipe inserted or updated");
                callback(true, recipe);
            })
            .catch((error) => {
                console.log("recipe insert or update error");
                callback(false);
            });
    }

    static updateRecipe(recipeId, title, description, isPublic, userId, pictureId, preparationTime, callback) {
        let recipe = new Recipe(recipeId, title, description, isPublic, userId, pictureId, preparationTime);
        new db.Recipes(recipe)
            .save(null, {method: 'insert'})
            .then((recipe) => {
                console.log("recipe inserted");
                callback(true, recipe);
            })
            .catch((error) => {
                console.log("recipe insert error");
                callback(false);
            });

    }
}

module.exports = Recipe;