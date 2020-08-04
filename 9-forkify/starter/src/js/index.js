// Global app controller

// apiKey: 813d09a5639c40c1a365135933f6dbc9
//'https://api.spoonacular.com/recipes/search?query=chicken&apiKey=813d09a5639c40c1a365135933f6dbc9'
// URL: https://api.spoonacular.com/recipes/search

import Search from "./models/Search";

import Recipe from "./models/Recipe";

import List from "./models/List";

import Likes from "./models/Likes";

import * as searchView from "./views/searchViews";
import * as recipeView from "./views/recipeViews";
import * as listView from "./views/listViews";
import * as likesView from "./views/likesViews";
import { elements, renderLoader, clearLoader } from "./views/base";

/*
GLOBAL STATE OF THE APP
    * Search object
    * Current recipe object
        * Shopping list object
* Liked recipe
*/
const state = {};
// window.state = state;

// Search controller
const controlSearch = async() => {
    //   console.log("Hooray");
    // 1. Get query from view
    let query = await searchView.getInput(); // TODO
    // console.log(query);
    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            // 4. search for recipes
            await state.search.getResult(query);

            // 5. Render result on UI
            // console.log(state.search.results);
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener("submit", el => {
    el.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});
// const r = new Recipe(
//   "http://www.edamam.com/ontologies/edamam.owl#recipe_09b4dbdf0c7244c462a4d2622d88958e"
// );
// console.log(r);
// r.getRecipe();
// console.log(r);
// r.parseIngredients();
// console.log(r);

const controlRecipe = async() => {
    const id = window.location.hash.replace("#", "");
    // console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightedSelected(id);

        // Create a new recipe object
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();

            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render Recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
            // console.log(state.recipe);
        } catch (error) {
            console.log("Your api doesn't work very well!");
        }
    }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach(event =>
    window.addEventListener(event, controlRecipe)
);
/*****
 * LIST CONTROLLER
 *****/
const controlList = () => {
    // Create a new list if none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/*****
 * LIKES CONTROLLER
 *****/


const controlLike = () => {
    // if (!state.likes) 
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the button
        likesView.toggleLikeBtn(true);
        // Add to the UI list

        // console.log(state.likes);
        likesView.renderLike(newLike)

        // User has like the current recipe
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the button

        // Remove to the UI list
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID);
        // console.log(state.likes);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore liked recipes from localstorage
window.addEventListener('load', () => {
    state.likes = new Likes();
    // Restore likes
    state.likes.readStorage();

    // Toggle like btn
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
});


elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    // console.log(state.recipe)
});

window.l = new List();

// Recipe controller

// controlSearch();
// console.log(state);
// search.getResult();