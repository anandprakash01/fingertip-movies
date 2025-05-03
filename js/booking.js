// Import configuration
import {API_URL, IMG_URL, search_URL} from "./config.js";
// Don't import getMovies - it won't work in this context

// DOM Elements
const moviesList = document.getElementById("movies-list");
const movieSearch = document.getElementById("search-movies");
const searchBtn = document.getElementById("search-btn");
const movieDetails = document.getElementById("movie-details");
const showDate = document.getElementById("show-date");
const timeSlots = document.querySelectorAll(".time-slot");
const seatMap = document.querySelector(".seat-map");
const adultCount = document.getElementById("adult-count");
const childCount = document.getElementById("child-count");
const seniorCount = document.getElementById("senior-count");
const ticketPrice = document.getElementById("ticket-price");
const convenienceFee = document.getElementById("convenience-fee");
const totalPrice = document.getElementById("total-price");
const proceedPayment = document.getElementById("proceed-payment");

// Variables
let selectedMovie = null;
let selectedTimeSlot = null;
let selectedSeats = [];
let pricePerAdult = 120.0;
let pricePerChild = 80.0;
let pricePerSenior = 100.0;
let convenienceFeeRate = 0.15; // 15% convenience fee

// Initialize date picker with today's date
const today = new Date();
const formattedDate = today.toISOString().split("T")[0];
showDate.value = formattedDate;
showDate.min = formattedDate;

async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      displayMoviesList(data.results);
    } else {
      moviesList.innerHTML = '<p class="error">No movies found.</p>';
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesList.innerHTML =
      '<p class="error">Failed to load movies. Please try again later.</p>';
  }
}

// Check URL parameters for movie selection
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  const movieTitle = urlParams.get("title");
  const movieLanguage = urlParams.get("language");
  const movieRating = urlParams.get("rating");

  if (movieId && movieTitle) {
    // If movie details are in URL, create a movie object
    selectedMovie = {
      id: movieId,
      title: movieTitle,
      poster_path: null,
      language: movieLanguage || "en",
      rating: movieRating || "N/A",
      release_date: "N/A",
    };
    displaySelectedMovie();
  } else {
    fetchMovies(API_URL);
  }
}

movieSearch.addEventListener("input", () => {
  const searchTxt = movieSearch.value;

  if (searchTxt) {
    fetchMovies(search_URL + "&query=" + searchTxt);
  } else {
    moviesList.innerHTML = "";
  }
});

// Display list of movies for selection
function displayMoviesList(movies) {
  moviesList.innerHTML = "";

  if (!movies || movies.length === 0) {
    moviesList.innerHTML = '<p class="error">No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
      <img src="${
        movie.poster_path ? IMG_URL + movie.poster_path : "./photo.jpg"
      }" alt="${movie.title}">
      <div class="movie-item-details">
        <h3>${movie.title}</h3>
        <p>${
          movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"
        } | ${movie.original_language.toUpperCase()}</p>
      </div>
    `;

    movieItem.addEventListener("click", () => {
      selectedMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        language: movie.original_language || "en", // Ensure language has a fallback
        rating: movie.vote_average || "N/A",
        release_date: movie.release_date || "N/A",
      };

      document.querySelectorAll(".movie-item").forEach(item => {
        item.classList.remove("selected");
      });
      movieItem.classList.add("selected");

      displaySelectedMovie();
      
      movieSearch.value = "";
      moviesList.innerHTML = "";
    });

    moviesList.appendChild(movieItem);
  });
}

// Display selected movie details
function displaySelectedMovie() {
  if (!selectedMovie) {
    movieDetails.innerHTML = '<p class="no-selection">Please select a movie</p>';
    return;
  }

  movieDetails.innerHTML = `
    <img src="${
      selectedMovie.poster_path ? IMG_URL + selectedMovie.poster_path : "./photo.jpg"
    }" alt="${selectedMovie.title}">
    <div class="movie-info">
      <h3>${selectedMovie.title}</h3>
      <p><strong>Language:</strong> ${
        selectedMovie.language ? selectedMovie.language.toUpperCase() : "N/A"
      }</p>
      <p><strong>Release Date:</strong> ${
        selectedMovie.release_date
          ? new Date(selectedMovie.release_date).toLocaleDateString()
          : "N/A"
      }</p>
      <div class="rating">
        <i class="fas fa-star"></i>
        <span>${
          typeof selectedMovie.rating === "number"
            ? selectedMovie.rating.toFixed(1)
            : selectedMovie.rating
        }/10</span>
      </div>
    </div>
  `;

  // Enable time slots
  timeSlots.forEach(slot => {
    slot.disabled = false;
  });
}

// Initialize the page
function init() {
  // Check URL parameters
  checkUrlParams();
  generateSeatMap();

  timeSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      if (!selectedMovie) {
        alert("Please select a movie first");
        return;
      }

      timeSlots.forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
      selectedTimeSlot = slot.textContent;
    });
  });

  // Ticket count controls
  document.querySelectorAll(".count-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const currentValue = parseInt(input.value);

      if (btn.classList.contains("plus") && currentValue < parseInt(input.max)) {
        input.value = currentValue + 1;
      } else if (btn.classList.contains("minus") && currentValue > parseInt(input.min)) {
        input.value = currentValue - 1;
      }

      calculatePrice();
    });
  });

  // Payment button
  proceedPayment.addEventListener("click", () => {
    if (!selectedMovie || !selectedTimeSlot || selectedSeats.length === 0) {
      alert("Please complete your selection");
      return;
    }

    alert(
      `Booking confirmed!\n\nMovie: ${selectedMovie.title}\nDate: ${
        showDate.value
      }\nTime: ${selectedTimeSlot}\nSeats: ${selectedSeats.join(", ")}\nTotal: ${
        totalPrice.textContent
      }`
    );

    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", init);

function generateSeatMap() {
  seatMap.innerHTML = "";

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

  rows.forEach(row => {
    const seatRow = document.createElement("div");
    seatRow.classList.add("seat-row");

    // Add row label
    const rowLabel = document.createElement("div");
    rowLabel.classList.add("row-label");
    rowLabel.textContent = row;
    seatRow.appendChild(rowLabel);

    for (let i = 1; i <= 12; i++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.classList.add("available");

      if (Math.random() < 0.2) {
        seat.classList.remove("available");
        seat.classList.add("occupied");
      }

      // Skip middle seats for aisle
      if (i === 4 || i === 9) {
        const aisle = document.createElement("div");
        aisle.classList.add("aisle");
        seatRow.appendChild(aisle);
      }

      const seatId = `${row}${i}`;
      seat.setAttribute("data-seat-id", seatId);

      // event for seat selection
      seat.addEventListener("click", () => {
        if (seat.classList.contains("occupied")) {
          return;
        }

        if (seat.classList.contains("selected")) {
          seat.classList.remove("selected");
          seat.classList.add("available");
          selectedSeats = selectedSeats.filter(id => id !== seatId);
        } else {
          if (selectedSeats.length >= 10) {
            alert("Maximum 10 tickets can be booked");
            return;
          }

          seat.classList.remove("available");
          seat.classList.add("selected");
          selectedSeats.push(seatId);
        }

        updateTicketCount();
        calculatePrice();
      });

      seatRow.appendChild(seat);
    }

    seatMap.appendChild(seatRow);
  });
}

function updateTicketCount() {
  const totalSeats = selectedSeats.length;

  adultCount.value = 0;
  childCount.value = 0;
  seniorCount.value = 0;

  adultCount.value = Math.min(totalSeats, 10);

  if (totalSeats >= 10) {
    alert("Maximum 10 tickets can be booked");
  }

  calculatePrice();
}

// Calculate ticket price
function calculatePrice() {
  const adults = parseInt(adultCount.value) || 0;
  const children = parseInt(childCount.value) || 0;
  const seniors = parseInt(seniorCount.value) || 0;

  const subtotal =
    adults * pricePerAdult + children * pricePerChild + seniors * pricePerSenior;
  const fee = subtotal * convenienceFeeRate;
  const total = subtotal + fee;

  ticketPrice.textContent = `₹${subtotal.toFixed(2)}`;
  convenienceFee.textContent = `₹${fee.toFixed(2)}`;
  totalPrice.textContent = `₹${total.toFixed(2)}`;

  // Enable/disable payment button
  if (selectedMovie && selectedTimeSlot && selectedSeats.length > 0 && total > 0) {
    proceedPayment.disabled = false;
  } else {
    proceedPayment.disabled = true;
  }
}
