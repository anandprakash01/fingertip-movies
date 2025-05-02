// API Configuration
const API_KEY = "api_key=d6a90eff85ca8ee94564a85d832ee40a";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/movie/now_playing?" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const search_URL = BASE_URL + "/search/movie?" + API_KEY;

// Export constants for use in other modules
export { API_KEY, BASE_URL, API_URL, IMG_URL, search_URL };