const params = new URLSearchParams(location.search);
const roomId = params.get('room_id') || 1;

function esc(text) {
  return String(text ?? '').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

fetch(`php/hotels.php?action=room&room_id=${roomId}`)
  .then(res => res.json())
  .then(data => {
    if (!data.success) throw new Error(data.message);

    const r = data.room;
    const image = r.image || 'assets/images/room1.jpg';
    const price = Number(r.price_per_night);
    const subtotal = price * 4;
    const total = subtotal + 120 - 100;

    document.getElementById('roomBreadcrumb').textContent = r.name;
    document.getElementById('roomName').textContent = r.name;
    document.getElementById('hotelLocation').textContent = `${r.hotel_name}, ${r.city}`;
    document.getElementById('rating').textContent = data.average_rating;
    document.getElementById('roomDescription').textContent = r.description;
    document.getElementById('price').textContent = `$${price.toFixed(0)}`;
    document.getElementById('nightsCalc').textContent = `$${price.toFixed(0)} × 4 nights`;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(0)}`;
    document.getElementById('total').textContent = `$${total.toFixed(0)}`;
    document.getElementById('bookBtn').href = `booking.php?room_id=${r.id}`;
    document.getElementById('roomImage').src = image;
    document.getElementById('roomImage2').src = image;
    document.getElementById('roomImage3').src = image;

    if (r.is_available != 1) {
      document.getElementById('availability').textContent = 'UNAVAILABLE';
      document.getElementById('availability').classList.add('danger');
      document.getElementById('bookBtn').classList.add('disabled');
      document.getElementById('bookBtn').removeAttribute('href');
    }
  })
  .catch(error => {
    document.getElementById('roomName').textContent = error.message;
  });

fetch("php/auth.php?action=session").then(r => r.json()).then(d => {
  if (d.user_name) document.getElementById("navUser").textContent = d.user_name;
});