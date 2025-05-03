import {getMovies} from "./movies.js";

// DOM Elements
const prevEl = document.getElementById("prev");
const nextEl = document.getElementById("next");

// Variables from movies.js
import {lastURL, currentPage, nextPage, prevPage, totalPages} from "./movies.js";

// Event listeners for pagination
prevEl.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

nextEl.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let splitUrl = lastURL.split("?");
  let queryPara = splitUrl[1].split("&");
  let pageUrl = queryPara[queryPara.length - 1].split("=");
  if (pageUrl[0] != "page") {
    let url = lastURL + "&page=" + page;
    getMovies(url);
  } else {
    pageUrl[1] = page.toString();
    let a = pageUrl.join("=");
    queryPara[queryPara.length - 1] = a;
    let b = queryPara.join("&");
    let url = splitUrl[0] + "?" + b;
    getMovies(url);
  }
}
