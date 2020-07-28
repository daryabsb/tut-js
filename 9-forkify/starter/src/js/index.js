// Global app controller

// apiKey: 813d09a5639c40c1a365135933f6dbc9
//'https://api.spoonacular.com/recipes/search?query=chicken&apiKey=813d09a5639c40c1a365135933f6dbc9'
// URL: https://api.spoonacular.com/recipes/search

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchViews";
import { elements, renderLoader, clearLoader } from "./views/base";

/*
GLOBAL STATE OF THE APP
    * Search object
    * Current recipe object
        * Shopping list object
* Liked recipe
*/
const state = {};

// Search controller
const controlSearch = async () => {
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
    // 4. search for recipes
    await state.search.getResult(query);

    // 5. Render result on UI
    // console.log(state.search.results);
    clearLoader();
    searchView.renderResults(state.search.result);
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

const r = new Recipe(
  "http://www.edamam.com/ontologies/edamam.owl#recipe_09b4dbdf0c7244c462a4d2622d88958e"
);
r.getRecipe();
console.log(r);
// Recipe controller
const controlRecipe = async () => {};

// controlSearch();
// console.log(state);
// search.getResult();
