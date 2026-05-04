const params = new URLSearchParams(window.location.search);
const bookingId = params.get("booking_id");

const confirmMain = document.getElementById("confirmMain");
const bookingCode = document.getElementById("bookingCode");

const paymentBase = document.getElementById("paymentBase");
const paymentService = document.getElementById("paymentService");
const paymentTotal = document.getElementById("paymentTotal");

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return (end - start) / (1000 * 60 * 60 * 24);
}

async function loadBooking() {
  if (!bookingId) {
    confirmMain.innerHTML = `<div class="error-box">No booking ID found.</div>`;
    bookingCode.textContent = "Not Found";
    return;
  }

  try {
    const response = await fetch(`php/booking.php?action=confirmation&booking_id=${encodeURIComponent(bookingId)}`);
    const data = await response.json();

    if (data.redirect) {
      window.location.href = data.redirect;
      return;
    }

    if (!data.success) {
      confirmMain.innerHTML = `<div class="error-box">${data.message}</div>`;
      bookingCode.textContent = "Not Found";
      return;
    }

    const b = data.booking;
    const nights = calculateNights(b.check_in, b.check_out);
    const pricePerNight = parseFloat(b.price_per_night);
    const base = nights * pricePerNight;
    const cleaning = 45;
    const service = base * 0.12;
    const total = base + cleaning + service;

    bookingCode.textContent = b.id;
    paymentBase.textContent = base.toFixed(2);
    paymentService.textContent = service.toFixed(2);
    paymentTotal.textContent = total.toFixed(2);

    confirmMain.innerHTML = `
      <div class="confirm-image-wrap">
        <img src="${b.room_image || 'assets/images/room-placeholder.jpg'}" alt="Room image" class="confirm-image">
        <span class="confirmed-badge">Confirmed</span>
      </div>
      <div class="confirm-room-body">
        <div class="confirm-room-header">
          <div>
            <h2>${b.room_name}</h2>
            <p><i class="fa-solid fa-location-dot"></i> &nbsp ${b.hotel_name}</p>
          </div>
          <div class="confirm-price">
            <strong>$${total.toFixed(2)}</strong>
            <span>Total Amount Paid</span>
          </div>
        </div>
        <div class="stay-dates">
          <div>
            <span>CHECK-IN</span>
            <strong>${b.check_in}</strong>
            <p>After 3:00 PM</p>
          </div>
          <div>
            <span>CHECK-OUT</span>
            <strong>${b.check_out}</strong>
            <p>Before 11:00 AM</p>
          </div>
        </div>
        <div class="amenities">
          <span><i class="fa-solid fa-user-group"></i> 2 Guests</span>
          <span><i class="fa-solid fa-bed"></i> 1 King Bed</span>
          <span><i class="fa-solid fa-wifi"></i> High-speed WiFi</span>
        </div>
      </div>
    `;

  } catch (error) {
    confirmMain.innerHTML = `<div class="error-box">Could not load booking details.</div>`;
    bookingCode.textContent = "Error";
  }
}

loadBooking();

fetch("php/auth.php?action=session").then(r => r.json()).then(d => {
  if (d.user_name) document.getElementById("navUser").textContent = d.user_name;
});