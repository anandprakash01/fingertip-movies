const API_KEY = "api_key=d6a90eff85ca8ee94564a85d832ee40a";
const BASE_URL = "https://api.themoviedb.org/3";
// const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const API_URL = BASE_URL + "/movie/now_playing?" + API_KEY;

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const search_URL = BASE_URL + "/search/movie?" + API_KEY;

const movieContainer = document.getElementById("movies-container");
const search = document.getElementById("search");
const searchBtn = document.getElementById("nav-search-btn");
const tagsEl = document.getElementById("tags"); //for genres

const prevEl = document.getElementById("prev"); //pagination
const nextEl = document.getElementById("next");
const currentEl = document.getElementById("current");

const popupContainer = document.getElementById("popup");

//varibles for pagination
let currentPage = 1;
let nextPage = 2;
let prevPage = 0;
let lastURL = "";
let totalPages = 10;

const genres = [
  // "/genre/movie/list"
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

let popupID;
let selectedGenres = [];

getMovies(API_URL);

setGenres();

function getMovies(url) {
  // fetch(url).then((res)=>{
  //     return res.json();
  // }).then((data)=>{
  //     // console.log(data);
  //     showMovies(data.results);
  // })
  lastURL = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
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
        // tagsEl.scrollIntoView({behavior:"smooth"});
        // search.scrollIntoView({behavior:"smooth"});
      } else {
        movieContainer.innerHTML = `<h1 class="no-result">No Results Found !</h1>`;
      }
    });
}

function showMovies(data) {
  movieContainer.innerHTML = " ";
  popupContainer.innerHTML = " ";

  data.forEach((movies) => {
    const {
      title,
      id,
      release_date,
      original_language,
      poster_path,
      vote_average,
      overview,
    } = movies;

    // -------------for movieContainer------------
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-card");
    // movieElement.id=id;
    movieElement.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "./photo.jpg"}">
            <div class="movie-name">${title}</div>
            <div class="movie-lang">
                <span>Language</span>
                <span>${original_language}</span>
            </div>
            <div class="movie-rating">
                <span>Rating</span>
                <span>${vote_average}</span>
            </div>
        `;

    movieContainer.appendChild(movieElement);

    // -------------for popup container---------------
    const popup = document.createElement("div");
    popup.classList.add("disciption-popup", "open-popup");
    popup.id = id;
    popup.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "./photo.jpg"}">
            <div class="movie-details">
                <div class="popup-name">${title}</div>
                <button class="close">X</button>
                <div class="popup-lang">${original_language}</div>
                <div class="popup-rating">${vote_average}/10</div>
                <div class="popup-date">Release Date: ${release_date}</div>
                <div class="popup-detail">${overview}</div>
                <button class="btn popup-btn book-now" onclick="bookinPopup()">Book Now</button>
            </div>
        `;
    popupContainer.appendChild(popup);

    // ----------------for popup display-------------

    movieElement.addEventListener("click", () => {
      let popid = id;
      // console.log('working');
      const popupCard = document.querySelectorAll(".disciption-popup");
      popupCard.forEach((movie) => {
        movie.classList.add("open-popup");
      });
      // const p = document.getElementById(id);
      popupCard.forEach((movie) => {
        // console.log("working");

        if (popid == movie.id) {
          const m = document.getElementById(movie.id);
          m.classList.remove("open-popup");
          m.style.transform = "scale(1)";

          //--------------for close btn-------
          const Btns = document.querySelectorAll(".close");
          Btns.forEach((btn) => {
            btn.addEventListener("click", () => {
              const btnpop = document.getElementById(movie.id);
              m.style.transform = "scale(0.1)";
              btnpop.classList.add("open-popup");
            });
          });
        }
      });
    });
  });
}

//booking popup

closeBtn();
function bookinPopup() {
  // const book = document.querySelectorAll('.book-now');
  // // console.log(book);
  // book.forEach(btn => {
  //     btn.addEventListener('click', () => {

  const p = document.getElementById("booking");
  p.style.transform = "scale(1)";
  p.classList.remove("open-popup");
  // })
  // });
}
function closeBtn() {
  const Btns = document.querySelectorAll(".close");
  // console.log(Btns);
  Btns.forEach((btn) => {
    if (btn.id == "booking-close") {
      btn.addEventListener("click", () => {
        console.log("working");
        const p = document.getElementById("booking");
        p.style.transform = "scale(0.1)";
        p.classList.add("open-popup");
      });
    }
  });
}

// Search functions
search.addEventListener("input", () => {
  const searchTxt = search.value;
  //to remove filters
  selectedGenres = [];
  setGenres();

  if (searchTxt) {
    getMovies(search_URL + "&query=" + searchTxt);
  } else {
    getMovies(API_URL);
  }
});
// function handle(e){
//     if (e.keyCode==13){
//         getMovies(search_URL+"&query="+searchTxt);
//     }
//     else{
//         getMovies(API_URL);
//     }
// }

// searchBtn.addEventListener("click", () => {
//     const searchTxt = search.value;
//     if (searchTxt) {
//         getMovies(search_URL + "&query=" + searchTxt);
//     }
//     else {
//         getMovies(API_URL);
//     }
// });

//genres fitltering
function setGenres() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
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
      // console.log(selectedGenres);
      //   getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenres.join(",")));
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenres.join("||")));
      //if we use without encodeURI it will still work but A comma in a string should be encoded as %2C.
      //A comma in a string should be encoded as %2C . It is recommended to use platform's normal URL building libraries to automatically encode your URLs
      HighlightSelectedGenre();
      // clearbtn();
    });
  });
}

function HighlightSelectedGenre() {
  const tags = document.querySelectorAll(".genres-types");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearbtn();
  if (selectedGenres.length != 0) {
    selectedGenres.forEach((id) => {
      const highlightedEl = document.getElementById(id);
      highlightedEl.classList.add("highlight");
    });
  }
}

//Clear button
function clearbtn() {
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

//Pagination
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
  // ==>> https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d6a90eff85ca8ee94564a85d832ee40a
  // ==>> https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d6a90eff85ca8ee94564a85d832ee40a&page=2
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
