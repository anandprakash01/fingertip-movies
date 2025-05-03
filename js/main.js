// Always import configuration
import "./config.js";

// This file is the entry point that loads all modules
document.addEventListener("DOMContentLoaded", () => {
  console.log("Fingertip Movies application initialized");
  
  // Check which page we're on by looking for specific elements
  const isMoviePage = document.getElementById("movies-container") !== null;
  const isBookingPage = document.querySelector(".booking-container") !== null;
  const isTheatersPage = document.querySelector(".theaters-container") !== null;
  
  // Only load movie-related scripts on pages that have the necessary elements
  if (isMoviePage) {
    // Use dynamic imports for page-specific modules
    import("./movies.js")
      .then(() => import("./search.js"))
      .then(() => import("./genres.js"))
      .then(() => import("./pagination.js"))
      .catch(error => console.error("Error loading movie modules:", error));
  }
  
  // Load other page-specific scripts as needed
  if (isBookingPage) {
    import("./booking.js")
      .catch(error => console.error("Error loading booking module:", error));
  }
  
  if (isTheatersPage) {
    import("./theaters.js")
      .catch(error => console.error("Error loading theaters module:", error));
  }
});
