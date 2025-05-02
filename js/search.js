// Import dependencies
import { search_URL, API_URL } from './config.js';
import { getMovies } from './movies.js';
import { selectedGenres, setGenres } from './genres.js';

// DOM Elements
const search = document.getElementById("search");

// Search event listener
search.addEventListener("input", () => {
  const searchTxt = search.value;
  //to remove filters
  selectedGenres.length = 0; // Clear the array
  setGenres();

  if (searchTxt) {
    getMovies(search_URL + "&query=" + searchTxt);
  } else {
    getMovies(API_URL);
  }
});