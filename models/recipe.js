var db = require('../database/database');

class Recipe {
    constructor(recipeId, title, description, isPublic, userId, pictureId) {
        if(recipeId !== undefined && recipeId > 0)
            this.recipeId = recipeId;
        this.title = title;
        this.description = description;
        this.public = isPublic;
        this.userId = userId;
        if(pictureId !== undefined)
            this.pictureId = pictureId;
    }

    static getRecipesByUserId(userId, callback) {
        new db.Recipes({userId : userId})
        .fetchAll({withRelated: ['ingredients', 'preparationSteps']})
        .then((model) => {
            if(model === null)
                callback({success: false});
            else
                callback({success: true, data : model});
        });
    }

    static getRecipeById(recipeId, callback) {
        new db.Recipes({recipeId : recipeId})
            .fetch()
            .then((model) => {
                if(model === null)
                    callback({success: false});
                else
                    callback({success: true, data : model});
            });
    }

    static saveRecipe(recipeId, title, description, isPublic, userId, pictureId, callback) {
            let recipe = new Recipe(recipeId, title, description, isPublic, userId, pictureId);
            new db.Recipes(recipe)
                .save(null, {  })
                .then((recipe) => {
                    console.log("recipe inserted or updated");
                    callback(true, recipe);
                })
                .catch((error) => {
                    console.log("recipe insert or update error");
                    callback(false);
                });

    }

    static updateRecipe(recipeId, title, description, isPublic, userId, pictureId, callback) {
        let recipe = new Recipe(recipeId, title, description, isPublic, userId, pictureId);
        new db.Recipes(recipe)
            .save(null, { method: 'insert' })
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