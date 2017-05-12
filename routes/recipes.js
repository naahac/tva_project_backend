var express = require('express');
var router = express.Router();

var Recipe = require('../models/recipe');

router.post('/', function (req, res, next) {
        Recipe.getRecipesByUserId(req.body.userId, (recipes) => {
            if (recipes === null) {
                res.status(404);
                res.send({ status: 'Recipes not found' });
            } else {
                res.json(recipes);
            }
        });
});

router.put('/', function (req, res, next) {
    Recipe.addRecipe(req.body.title, req.body.description, req.body.isPublic, req.body.userId, req.body.pictureId, (recipes) => {
        if (recipes === null) {
            res.status(404);
            res.send({ status: 'Recipes not found' });
        } else {
            res.json(recipes);
        }
    });
});

module.exports = router;