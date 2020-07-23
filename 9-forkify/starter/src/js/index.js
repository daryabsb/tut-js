// Global app controller

// apiKey: 813d09a5639c40c1a365135933f6dbc9
//'https://api.spoonacular.com/recipes/search?query=chicken&apiKey=813d09a5639c40c1a365135933f6dbc9'
// URL: https://api.spoonacular.com/recipes/search

import Search from "./models/Search";
import * as searchView from "./views/searchViews";
import { elements } from "./views/base";

/*
GLOBAL STATE OF THE APP
    * Search object
    * Current recipe object
        * Shopping list object
* Liked recipe
*/
const state = {};

const controlSearch = async () => {
  //   console.log("Hooray");
  // 1. Get query from view
  let query = await searchView.getInput(); // TODO
  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for result

    // 4. search for recipes
    await state.search.getResult();

    // 5. Render result on UI
    console.log(state.search.results);
  }
};

elements.searchForm.addEventListener("submit", el => {
  el.preventDefault();
  controlSearch();
});

// controlSearch();
// console.log(state);
// search.getResult();
