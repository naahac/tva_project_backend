var express = require('express');
var router = express.Router();
var checkToken = require('../utilities/checkToken');
var Recipe = require('../models/recipe');
var User = require('../models/user');
var Token = require('../models/token');
let PreparationStep = require('../models/preparation_step');
let Ingredient = require('../models/ingredient');
var Picture = require('../models/picture');

router.post('/', function (req, res, next) {
    var recipe = req.body.recipe;
    checkToken(req.body.tokenId, res);
    User.getUserIdByToken(req.body.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({status: 'User was not found!'});
        }
        if (recipe.picture.pictureId === undefined || recipe.picture.pictureId < 1) {
            Picture.addPicture(recipe.picture.base64Data, (success, picture) => {
                if (!success) {
                    res.status(500);
                    res.send({status: 'Picture not added'});
                } else {
                    addRecipe(recipe, result.userId, picture.attributes.pictureId, (success) => {
                        if (!success) {
                            res.status(500);
                            res.send({status: 'Recipe not inserted'});
                        } else {
                            res.status(200);
                            res.send({status: 'Recipe inserted'});
                        }
                    });
                }
            });
        }else {
            addRecipe(recipe, result.userId, recipe.picture.pictureId, (success) => {
                if (!success) {
                    res.status(500);
                    res.send({status: 'Recipe not inserted'});
                } else {
                    res.status(200);
                    res.send({status: 'Recipe inserted'});
                }
            });
        }
    });
});

router.get('/:tokenId', function (req, res, next) {
    checkToken(req.params.tokenId, res);
    User.getUserIdByToken(req.params.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({status: 'User was not found!'});
        }else {
            Recipe.getRecipesByUserId(result.userId, (result) => {
                if (result === null || !result.success) {
                    res.status(404);
                    res.send({status: 'Recipes not found'});
                } else {

                    res.json(result.data);
                }
            });
        }

    });
});

router.post('/search', function (req, res, next) {
    checkToken(req.body.tokenId, res);
    User.getUserIdByToken(req.body.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({status: 'User was not found!'});
        }else {
            Recipe.getRecipesByUserId(result.userId, (result) => {
                if (result === null || !result.success) {
                    res.status(404);
                    res.send({status: 'Recipes not found'});
                } else {

                    res.json(result.data);
                }
            });
        }
    });
});

router.get('/:tokenId:recipeId', function (req, res, next) {
    checkToken(req.params.tokenId, res);
    User.getUserIdByToken(req.params.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({status: 'User was not found!'});
        }else{
            // Recipe.getRecipesByUserId(result.userId, (result) => {
            //     if (result === null || !result.success) {
            //         res.status(404);
            //         res.send({status: 'Recipes not found'});
            //     } else {
            //
            //         res.json(result.data);
            //     }
            // });

        }
    });
});

router.put('/', function (req, res, next) {
    var recipe = req.body.recipe;
    checkToken(req.body.tokenId, res);
    User.getUserIdByToken(req.body.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({status: 'User was not found!'});
        }
        if (recipe.picture.pictureId === undefined || recipe.picture.pictureId < 1) {
            Picture.addPicture(recipe.picture.base64Data, (success, picture) => {
                if (!success) {
                    res.status(500);
                    res.send({status: 'Picture not added'});
                } else {
                    addRecipe(recipe, result.userId, picture.attributes.pictureId, (success) => {
                        if (!success) {
                            res.status(500);
                            res.send({status: 'Recipe not inserted'});
                        } else {
                            res.status(200);
                            res.send({status: 'Recipe inserted'});
                        }
                    });
                }
            });
        }else {
            addRecipe(recipe, result.userId, recipe.picture.pictureId, (success) => {
                if (!success) {
                    res.status(500);
                    res.send({status: 'Recipe not inserted'});
                } else {
                    res.status(200);
                    res.send({status: 'Recipe inserted'});
                }
            });
        }
    });
});

function addRecipe(recipe,userId, pictureId, callback){
    Recipe.saveRecipe(recipe.recipeId,recipe.title, recipe.description, recipe.isPublic, userId, pictureId, (success, insertedRecipe) => {
        if (!success) {
            callback(false);
        } else {
            addIngredientsAndSteps(recipe, insertedRecipe);
            callback(true);
        }
    });
}

function addIngredientsAndSteps(recipe, insertedRecipe){
    for(let i = 0; i<recipe.ingredients.length; i++){
        let ingredient = recipe.ingredients[i];
        Ingredient.addIngredient(ingredient.ingredientId,ingredient.name,ingredient.amount,insertedRecipe.attributes.recipeId, (success, insertedIngredient) => {
            console.log('insert ingredient: ' + success + ', ' + success ? insertedIngredient.attributes.ingredientId : " -1");
        });
    }
    for(let i = 0; i<recipe.preparationSteps.length; i++){
        let preparationStep = recipe.preparationSteps[i];
        PreparationStep.addPreparationStep(preparationStep.preparationStepId,preparationStep.Description,insertedRecipe.attributes.recipeId, (success, insertedStep) => {
            console.log('insert step: ' + success + ', ' + success ? insertedStep.attributes.preparationStepId : " -1");
        });
    }
}

module.exports = router;