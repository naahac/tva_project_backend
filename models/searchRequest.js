var db = require('../database/database');

class SearchRequest {
    constructor(token, recipeName, minPreparationSteps, maxPreparationSteps, minIngredients, maxIngredients, minPreparationTime, maxPreparationTime) {
        this.token = token;
        this.recipeName = recipeName;
        this.minPreparationSteps = minPreparationSteps;
        this.maxPreparationSteps = maxPreparationSteps;
        this.minIngredients = minIngredients;
        this.maxIngredients = maxIngredients;
        this.minPreparationTime = minPreparationTime;
        this.maxPreparationTime = maxPreparationTime;
    }
}

module.exports = SearchRequest;