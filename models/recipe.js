var db = require('../database/database');

class Recipe {
    constructor(recipeId, title, description, isPublic, userId, pictureId) {
        if(recipeId !== undefined)
            this.recipeId = recipeId;
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
        this.userId = userId;
        if(pictureId !== undefined)
            this.pictureId = pictureId;
    }

    static getRecipesByUserId(userId, callback) {
        new db.Recipes({userId : userId})
        .fetch()
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

    static addRecipe(title, description, isPublic, userId, pictureId, callback) {
            let recipe = new Recipe(undefined, title, description, isPublic, userId, pictureId);
            new db.Recipes(recipe).save(null, { method: 'insert' });
            console.log("recipe inserted");
            callback(true);
    }
}

module.exports = Recipe;