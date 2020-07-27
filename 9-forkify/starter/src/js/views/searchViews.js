import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => (elements.searchInput.value = "");
export const clearResult = () => (elements.searchResList.innerHTML = "");
/*
 * Pasta with Tomato and spinach
 * 0
 */
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
                <li>
                    <a class="results__link results__link--active" href="#${
                      recipe.recipe.uri
                    }">
                        <figure class="results__fig">
                            <img src="${recipe.recipe.image}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(
                              recipe.recipe.label
                            )}</h4>
                            <p class="results__author">${
                              recipe.recipe.source
                            }</p>
                        </div>
                    </a>
                </li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${
      type === "prev" ? "left" : "right"
    }"></use>
</svg>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
</button>`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // Button to go next
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons show
    button = `${createButton(page, "prev")}
              ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    // Only button goes to prev
    button = createButton(page, "prev");
  }
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //   console.log(recipe);
  const srart = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(srart, end).forEach(renderRecipe);
};
