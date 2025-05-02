// Popup handling functions
function bookingPopup() {
  const p = document.getElementById("booking");
  p.style.transform = "scale(1)";
  p.classList.remove("open-popup");
}

function closeBtn() {
  const Btns = document.querySelectorAll(".close");
  Btns.forEach(btn => {
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

// Initialize
function initializePopups() {
  // Add event listeners to all booking buttons
  document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', bookingPopup);
  });
  
  // Add event listener to the book link in footer
  const bookLink = document.querySelector('.box a[href="#"]:nth-of-type(2)');
  if (bookLink) {
    bookLink.addEventListener('click', bookingPopup);
  }
  
  closeBtn();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePopups);

// Export functions for use in other modules
export {bookingPopup, closeBtn, initializePopups};
