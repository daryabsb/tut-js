import axios from "axios";
import { apiKey, app_id, searchURL } from "../config";
export default class Search {
  constructor(query) {
    this.query = query;
  }
  // https://api.edamam.com/search?q=pizza&app_id=ae923f55&app_key=c180230477b277f56a0e6e75c61f23ae
  async getResult(query) {
    try {
      // apiKey = "c180230477b277f56a0e6e75c61f23ae";
      // app_id = "ae923f55";
      // searchURL = "https://api.edamam.com/search";

      // console.log(`${searchURL}?q=${query}&app_id=${app_id}&app_key=${apiKey}`);
      const result = await axios(
        `${searchURL}?q=${query}&app_id=${app_id}&app_key=${apiKey}`
      );
      // console.log(result.data.hits.recipe);

      this.result = result.data.hits; //.data.hits.recipe;
      // console.log(result.data.hits.recipe);
      // this.result.forEach(recipe => console.log(recipe.recipe));
      // console.log(this.result);
    } catch (err) {
      console.log(err);
    }
  }
}
