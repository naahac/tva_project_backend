var db = require('../database/database');

class Ingredient {
    constructor(ingredientId, name, amount, recipeId) {
        if(ingredientId !== undefined && ingredientId > 0)
            this.ingredientId = ingredientId;
        this.name = name;
        this.amount = amount;
        this.recipeId = recipeId;
    }


    static getIngredientsByRecipeId(recipeId, callback) {
        new db.Ingredients({recipeId : recipeId})
            .fetch()
            .then((model) => {
                if(model === null)
                    callback({success: false});
                else
                    callback({success: true, data : model});
            });
    }

    static addIngredient(ingredientId, name, amount, recipeId, callback) {
            let ingredient = new Ingredient(undefined, name, amount, recipeId);
            new db.Ingredients(ingredient)
                .save(null, { })
                .then((ingredient) => {
                    console.log("ingredient inserted");
                    callback(true, ingredient);
                })
                .catch((error) => {
                    console.log("ingredient insert error");
                    callback(false, error);
                });
    }

    static deleteIngredients(recipeId, callback) {
        new db.Ingredients()
            .where({recipeId: recipeId})
            .destroy()
            .then((ingredient) => {
                console.log("ingredient deleted");
                callback(true, ingredient);
            })
            .catch((error) => {
                console.log("ingredient delete error");
                callback(false, error);
            });
    }
}

module.exports = Ingredient;