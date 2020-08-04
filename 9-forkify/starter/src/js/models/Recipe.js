import axios from "axios";
import { apiKey, app_id, searchURL, rBase } from "../config";
export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    // https://api.edamam.com/search?q=pizza&app_id=ae923f55&app_key=c180230477b277f56a0e6e75c61f23ae
    async getRecipe() {
        try {
            //https://api.edamam.com/search?r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_432572b1569c50fe1d3d5959671be29a&app_id=ae923f55&app_key=c180230477b277f56a0e6e75c61f23ae
            //   apiKey = "c180230477b277f56a0e6e75c61f23ae";
            //   app_id = "ae923f55";
            //   searchURL = "https://api.edamam.com/search";
            //   const rBase = "http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23";

            let hashIndex = this.id.indexOf("#") + 1;
            let recId = this.id.slice(hashIndex);

            const r = `${rBase}${recId}`;
            const res = await axios(
                `${searchURL}?r=${r}&app_id=${app_id}&app_key=${apiKey}`
            );
            let Ings = res.data[0].ingredients.map(el => el.text);
            this.title = res.data[0].label;
            this.author = res.data[0].source;
            this.img = res.data[0].image;
            this.url = res.data[0].url;
            this.ingredients = Ings;
            this.servings = res.data[0];
        } catch (err) {
            console.log(err);
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each ingredient

        const numIng = this.ingredients.length;
        const periods = numIng / 3;
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = [
            "tablespoons",
            "tablespoon",
            "ounces",
            "ounce",
            "teaspoons",
            "teaspoon",
            "cups",
            "pounds"
        ];
        const unitsShort = [
            "tbsp",
            "tbsp",
            "oz",
            "oz",
            "tsp",
            "tsp",
            "cup",
            "pound"
        ];

        const units = [...unitsShort, "kg", "g"];

        // console.log(this.ingredients);
        // if (this.ingredients) {
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            // 3) Parse ingredients into count, unit and ingredient

            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //   // There is a unit
                // console.log("A");
                const arrCount = parseFloat(arrIng.slice(0, unitIndex)); // Ex 4 1/2 cups, arrCount = 4 1/2
                let count;
                if (arrCount.length === 1) {
                    // console.log("B");
                    count = arrIng[0].replace("-", "+");
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join("+"));
                }
                // console.log(count + arrIng[unitIndex] + arrIng.slice(unitIndex + 1).join(" "));
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(" ")
                };
                // console.log("C");
            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but first element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: "",
                    ingredient: arrIng.slice(1).join(" ")
                };
                // console.log("D");
            } else if (unitIndex === -1) {
                // There is no units and no number
                objIng = {
                    count: 1,
                    unit: "",
                    ingredient
                };
                // console.log("E");
            }
            // console.log(ingredient);
            return objIng;
        });
        // }
        this.ingredients = newIngredients;
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