import axios from "axios";
export default class Search {
  constructor(query, number) {
    this.query = query;
    this.number = number;
  }

  async getResult(query, number) {
    try {
      const apiKey = "813d09a5639c40c1a365135933f6dbc9";
      const searchURL = "https://api.spoonacular.com/recipes/search";
      let num;
      if (this.number) {
        num = "&number=" + this.number;
      } else {
        num = "";
      }
      // console.log(num);
      const result = await axios(
        `${searchURL}?query=${this.query + num}&apiKey=${apiKey}`
      );
      this.result = result.data.results;
      //console.log(result.data.results);
      console.log(this.result);
    } catch (err) {
      console.log(err);
    }
  }
}
