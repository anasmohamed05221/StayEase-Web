
const hotelId = new URLSearchParams(window.location.search).get("hotel_id") || 1;

fetch(`php/reviews.php?action=fetch&hotel_id=${hotelId}`)
  .then(res => res.text())
  .then(data => {
    document.getElementById("reviewsContainer").innerHTML = data;
  });