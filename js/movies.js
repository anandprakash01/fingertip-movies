import {API_URL, IMG_URL, search_URL} from "./config.js";

// DOM Elements
const movieContainer = document.getElementById("movies-container");
const popupContainer = document.getElementById("popup");
const search = document.getElementById("search");
const searchBtn = document.getElementById("nav-search-btn");
const tagsEl = document.getElementById("tags"); //for genres
const prevEl = document.getElementById("prev"); //pagination
const nextEl = document.getElementById("next");
const currentEl = document.getElementById("current");

// Variables for pagination
let currentPage = 1;
let nextPage = 2;
let prevPage = 0;
let lastURL = "";
let totalPages = 10;

getMovies(API_URL);

function getMovies(url) {
  lastURL = url;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      if (data.results.length != 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        if (currentPage <= 1) {
          prevEl.classList.add("disabled");
        } else if (currentPage >= totalPages) {
          nextEl.classList.add("disabled");
        } else {
          prevEl.classList.remove("disabled");
          nextEl.classList.remove("disabled");
        }
      } else {
        movieContainer.innerHTML = `<h1 class="no-result">No Results Found !</h1>`;
      }
    });
}

function showMovies(data) {
  movieContainer.innerHTML = " ";
  popupContainer.innerHTML = " ";

  data.forEach(movies => {
    let {
      title,
      id,
      release_date,
      original_language,
      poster_path,
      vote_average,
      overview,
    } = movies;

    vote_average = vote_average.toFixed(1);

    // -------------for movieContainer------------
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-card");
    movieElement.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "./photo.jpg"}">
            <div class="movie-name">${title}</div>
            <div class="movie-lang">
                <span>Language</span>
                <span>${original_language}</span>
            </div>
            <div class="movie-rating">
                <span>Rating</span>
                <span>${vote_average}/10</span>
            </div>
        `;

    movieContainer.appendChild(movieElement);

    // -------------for popup container---------------
    const popupWrapper = document.createElement("div");
    popupWrapper.classList.add("popup-blur", "open-popup");
    popupWrapper.id = id;
    popupWrapper.innerHTML = `
          <div class="description-popup">
            <button class="close">✕</button>
            <img src="${poster_path ? IMG_URL + poster_path : "./photo.jpg"}">
            <div class="movie-details">
                <div class="popup-name">${title}</div>
                <div class="popup-lang">${original_language}</div>
                <div class="popup-rating">${vote_average}/10</div>
                <div class="popup-date">Release Date: ${release_date}</div>
                <div class="popup-detail">${overview}</div>
                <a href="booking.html?id=${id}&title=${encodeURIComponent(
      title
    )}&language=${original_language}&rating=${vote_average}" class="btn popup-btn book-now">Book Now</a>
            </div>
          </div>
        `;
    popupContainer.appendChild(popupWrapper);

    // ----------------for popup display-------------
    movieElement.addEventListener("click", () => {
      let popid = id;
      const popupCard = document.querySelectorAll(".popup-blur");
      popupCard.forEach(movie => {
        movie.classList.add("open-popup");
      });
      popupCard.forEach(movie => {
        if (popid == movie.id) {
          const popupWrapper = document.getElementById(movie.id);
          popupWrapper.classList.remove("open-popup");
          const popupContent = popupWrapper.querySelector(".description-popup");
          popupContent.style.transform = "scale(1)";

          //--------------for close btn-------
          const Btns = document.querySelectorAll(".close");
          Btns.forEach(btn => {
            btn.addEventListener("click", () => {
              popupContent.style.transform = "scale(0.1)";
              popupWrapper.classList.add("open-popup");
            });
          });
        }
      });
    });
  });
}

export { getMovies,showMovies,search, currentPage, nextPage, prevPage, lastURL, totalPages };
