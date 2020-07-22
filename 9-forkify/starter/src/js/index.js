// Global app controller

// apiKey: 813d09a5639c40c1a365135933f6dbc9
//'https://api.spoonacular.com/recipes/search?query=chicken&apiKey=813d09a5639c40c1a365135933f6dbc9'
// URL: https://api.spoonacular.com/recipes/search

import Search from "./models/Search";

const search = new Search("pizza", 5);
// console.log();
search.getResult();
