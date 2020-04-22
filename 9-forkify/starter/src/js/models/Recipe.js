import axios from 'axios';
import {apiKey, baseUrl, proxy} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const recipeUrl = `${proxy}${baseUrl}/${this.id}/information?apiKey=${apiKey}&includeNutrition=false`;
            const result = await axios.get(recipeUrl);
            // console.log(result);
            this.title = result.data.title;
            this.author = result.data.sourceName;
            this.img = result.data.image;
            this.url = result.data.sourceUrl;
            this.ingredients = result.data.extendedIngredients; // Array
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        this.ingredients = this.ingredients.map(el => {
            return {
                count: el.amount,
                unit: el.unit,
                ingredient: el.name
            };
        });
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}

