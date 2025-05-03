// Import dependencies
import {API_KEY, BASE_URL, API_URL} from "./config.js";
import {getMovies} from "./movies.js";

// DOM Elements
let tagsEl;

// Genres data
const genres = [
  {id: 28, name: "Action"},
  {id: 12, name: "Adventure"},
  {id: 16, name: "Animation"},
  {id: 35, name: "Comedy"},
  {id: 80, name: "Crime"},
  {id: 99, name: "Documentary"},
  {id: 18, name: "Drama"},
  {id: 10751, name: "Family"},
  {id: 14, name: "Fantasy"},
  {id: 36, name: "History"},
  {id: 27, name: "Horror"},
  {id: 10402, name: "Music"},
  {id: 9648, name: "Mystery"},
  {id: 10749, name: "Romance"},
  {id: 878, name: "Science Fiction"},
  {id: 10770, name: "TV Movie"},
  {id: 53, name: "Thriller"},
  {id: 10752, name: "War"},
  {id: 37, name: "Western"},
];

// Variables
let selectedGenres = [];

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  tagsEl = document.getElementById("tags");
  if (tagsEl) {
    setGenres();
    console.log("Genres initialized");
  } else {
    console.error("Tags element not found");
  }
});

function setGenres() {
  if (!tagsEl) return;

  tagsEl.innerHTML = "";
  genres.forEach(genre => {
    const t = document.createElement("div");
    t.classList.add("genres-types");
    t.id = genre.id;
    t.innerText = genre.name;
    tagsEl.appendChild(t);
    t.addEventListener("click", () => {
      if (selectedGenres.length == 0) {
        selectedGenres.push(genre.id);
      } else {
        if (selectedGenres.includes(genre.id)) {
          selectedGenres.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenres.splice(idx, 1);
            }
          });
        } else {
          selectedGenres.push(genre.id);
        }
      }
      // Use the discover endpoint instead of now_playing for genre filtering
      const genreURL =
        BASE_URL +
        "/discover/movie?" +
        API_KEY +
        "&with_genres=" +
        selectedGenres.join(",");
      getMovies(genreURL);
      HighlightSelectedGenre();
    });
  });
}

function HighlightSelectedGenre() {
  const tags = document.querySelectorAll(".genres-types");
  tags.forEach(tag => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenres.length != 0) {
    selectedGenres.forEach(id => {
      const highlightedEl = document.getElementById(id);
      highlightedEl.classList.add("highlight");
    });
  }
}

function clearBtn() {
  const clrBtn = document.getElementById("clearBtn");
  if (clrBtn) {
    if (selectedGenres.length == 0) {
      setGenres();
    }
  } else {
    const clear = document.createElement("div");
    clear.classList.add("genres-types", "highlight");
    clear.id = "clearBtn";
    clear.innerText = "Clear All";
    clear.addEventListener("click", () => {
      selectedGenres = [];
      setGenres();
      getMovies(API_URL);
    });
    tagsEl.appendChild(clear);
  }
}

export {setGenres, HighlightSelectedGenre, clearBtn, selectedGenres};
