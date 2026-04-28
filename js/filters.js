const form     = document.getElementById('filtersForm');
const slider   = document.getElementById('priceRange');
const priceMax = document.getElementById('priceMax');

slider.addEventListener('input', () => {
  priceMax.textContent = '$' + slider.value;
});

slider.addEventListener('change', () => form.submit());

form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => form.submit());
});