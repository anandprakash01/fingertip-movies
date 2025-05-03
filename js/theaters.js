const theaters = [
  {
    id: 1,
    name: "PVR Cinemas",
    location: "Delhi",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2luZW1hfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["Dolby Atmos", "IMAX", "Food Court", "Parking"],
  },
  {
    id: 2,
    name: "INOX Leisure",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2luZW1hfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["Recliner Seats", "3D", "Cafe", "Valet"],
  },
  {
    id: 3,
    name: "Cinepolis",
    location: "Pune",
    image:
      "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2luZW1hfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["4DX", "VIP Lounge", "Gaming Zone"],
  },
  {
    id: 4,
    name: "Carnival Cinemas",
    location: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["Premium Screens", "Snack Bar", "Accessible Seating"],
  },
  {
    id: 5,
    name: "SPI Cinemas",
    location: "Delhi",
    image:
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["Luxury Seating", "Gourmet Food", "Valet Parking"],
  },
  {
    id: 6,
    name: "Wave Cinemas",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["Gold Class", "Kids Zone", "Surround Sound"],
  },
  {
    id: 7,
    name: "PVR TreasureIsland",
    location: "Indore",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["IMAX", "Dolby Atmos", "Luxury Recliners", "Food Court"],
  },
  {
    id: 8,
    name: "INOX C21 Mall",
    location: "Indore",
    image:
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    facilities: ["3D Screens", "Premium Lounge", "Gourmet Food"],
  },
];

const theatersList = document.getElementById("theaters-list");
const theaterSearch = document.getElementById("theater-search");
const locationButtons = document.querySelectorAll(".location-btn");

// Display theaters
function displayTheaters(theatersToDisplay) {
  theatersList.innerHTML = "";

  if (theatersToDisplay.length === 0) {
    theatersList.innerHTML = '<p class="no-result">No theaters found!</p>';
    return;
  }

  theatersToDisplay.forEach(theater => {
    const theaterCard = document.createElement("div");
    theaterCard.classList.add("theater-card");

    let facilitiesHTML = "";
    theater.facilities.forEach(facility => {
      facilitiesHTML += `<span class="facility">${facility}</span>`;
    });

    theaterCard.innerHTML = `
      <img src="${theater.image}" alt="${theater.name}">
      <div class="theater-info">
        <div class="theater-name">${theater.name}</div>
        <div class="theater-location">${theater.location}</div>
        <div class="theater-facilities">${facilitiesHTML}</div>
        <button class="btn book-now" style="margin-top: 1rem;">View Shows</button>
      </div>
    `;

    theatersList.appendChild(theaterCard);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  displayTheaters(theaters);

  document.querySelectorAll(".location-btn").forEach(button => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      document.querySelectorAll(".location-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      const location = this.getAttribute("data-location");

      if (location === "all") {
        displayTheaters(theaters);
      } else {
        const filteredTheaters = theaters.filter(
          theater => theater.location === location
        );
        displayTheaters(filteredTheaters);
      }
    });
  });

  const searchInput = document.getElementById("theater-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();

      if (searchTerm === "") {
        const activeLocation = document
          .querySelector(".location-btn.active")
          .getAttribute("data-location");
        if (activeLocation === "all") {
          displayTheaters(theaters);
        } else {
          const filteredTheaters = theaters.filter(
            theater => theater.location === activeLocation
          );
          displayTheaters(filteredTheaters);
        }
      } else {
        const filteredTheaters = theaters.filter(theater => {
          return (
            theater.name.toLowerCase().includes(searchTerm) ||
            theater.location.toLowerCase().includes(searchTerm) ||
            theater.facilities.some(facility =>
              facility.toLowerCase().includes(searchTerm)
            )
          );
        });
        displayTheaters(filteredTheaters);
      }
    });
  }
});
