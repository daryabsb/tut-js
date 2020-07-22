import str from "./models/Search";

//import { add as a, multiply as m, ID } from "./views/searchViews";

import * as searchView from "./views/searchViews";
console.log(str);
console.log(
  ` Using imported function! ${searchView.ID}: ${searchView.multiply(
    5,
    4
  )} and ${searchView.add(4, 5)}`
);
