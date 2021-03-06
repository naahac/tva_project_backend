var db = require('../database/database');

class PreparationStep {
    constructor(preparationStepId, description, recipeId) {
        if(preparationStepId !== undefined && preparationStepId > 0)
            this.preparationStepId = preparationStepId;
        this.Description = description;
        this.recipeId = recipeId;
    }


    static getPreparationStepsByRecipeId(recipeId, callback) {
        new db.PreparationSteps({recipeId : recipeId})
            .fetch()
            .then((model) => {
                if(model === null)
                    callback({success: false});
                else
                    callback({success: true, data : model});
            });
    }

    static addPreparationStep(preparationStepId, description, recipeId, callback) {
            let preparationStep = new PreparationStep(undefined, description, recipeId);
            new db.PreparationSteps(preparationStep)
                .save(null, {  })
                .then((recipe) => {
                    console.log("step inserted");
                    callback(true, recipe);
                })
                .catch((error) => {
                    console.log("step insert error");
                    callback(false, error);
                });
    }

    static deletePreparationSteps(recipeId, callback) {
        new db.PreparationSteps()
            .where({recipeId: recipeId})
            .destroy()
            .then((ingredient) => {
                console.log("step deleted");
                callback(true, ingredient);
            })
            .catch((error) => {
                console.log("step delete error");
                callback(false);
            });
    }
}

module.exports = PreparationStep;