/* =============================================================
   js/main.js — StayEase Frontend JavaScript
   Member 2: Mohamed Gamil

   This file handles:
   1. Search form date validation (check-out must be after check-in)
   2. Auto-filling today's date as the minimum selectable date
   3. Reading URL params to display the search summary on results page
   4. Price range slider live update
   5. Wishlist heart toggle
   ============================================================= */

// ── 1. Run everything after the HTML is fully loaded ──────────────────────
document.addEventListener('DOMContentLoaded', function () {

  setMinDates();
  initSearchValidation();
  initResultsPageHeader();
  initPriceSlider();
  initWishlistButtons();

});

/* =============================================================
   FUNCTION: setMinDates
   Prevents users from selecting past dates.
   Sets the minimum value of both date inputs to today.
============================================================= */
function setMinDates() {
  var today = new Date().toISOString().split('T')[0]; // format: "2024-10-24"

  var checkIn  = document.getElementById('check_in');
  var checkOut = document.getElementById('check_out');

  if (checkIn)  checkIn.setAttribute('min', today);
  if (checkOut) checkOut.setAttribute('min', today);

  // When check-in changes, update check-out minimum to be at least that date
  if (checkIn && checkOut) {
    checkIn.addEventListener('change', function () {
      checkOut.setAttribute('min', this.value);

      // If check-out is now before check-in, clear it
      if (checkOut.value && checkOut.value < this.value) {
        checkOut.value = '';
      }
    });
  }
}

/* =============================================================
   FUNCTION: initSearchValidation
   Intercepts the search form submission.
   If check-out is not after check-in, shows an error and
   STOPS the form from submitting (preventDefault).
============================================================= */
function initSearchValidation() {
  var form = document.getElementById('searchForm');
  if (!form) return; // only runs on pages that have the search form

  form.addEventListener('submit', function (e) {
    var checkIn  = document.getElementById('check_in');
    var checkOut = document.getElementById('check_out');
    var errorEl  = document.getElementById('dateError');

    // Hide any previous error first
    if (errorEl) errorEl.classList.remove('visible');

    // Only validate if both dates are filled in
    if (checkIn && checkOut && checkIn.value && checkOut.value) {
      var inDate  = new Date(checkIn.value);
      var outDate = new Date(checkOut.value);

      // check-out must be STRICTLY after check-in
      if (outDate <= inDate) {
        e.preventDefault(); // stop the form from sending

        // Show the error message (CSS makes it visible via .visible class)
        if (errorEl) errorEl.classList.add('visible');

        // Shake the search bar to draw attention
        var searchBox = document.querySelector('.search-box');
        if (searchBox) {
          searchBox.style.animation = 'none';
          searchBox.style.border = '2px solid #DC2626';
          setTimeout(function () {
            searchBox.style.border = '';
          }, 2000);
        }

        return; // stop here
      }
    }

    // Also validate that city is not empty
    var cityInput = document.getElementById('city');
    if (cityInput && cityInput.value.trim() === '') {
      e.preventDefault();
      cityInput.focus();
      cityInput.style.outline = '2px solid #DC2626';
      setTimeout(function () { cityInput.style.outline = ''; }, 2000);
    }
  });
}

/* =============================================================
   FUNCTION: initResultsPageHeader
   Reads the URL parameters on the search-results page and
   updates the h1 and subtitle with the user's search details.

   Example URL: search-results.html?city=London&check_in=2024-10-24&check_out=2024-10-28&guests=2
   Displays: "Showing 124 hotels in London"
             "Selected dates: Oct 24 - Oct 28 · 2 Guests"
============================================================= */
function initResultsPageHeader() {
  var titleEl    = document.getElementById('resultsTitle');
  var subtitleEl = document.getElementById('resultsSubtitle');
  if (!titleEl) return; // only runs on search-results page

  // URLSearchParams reads the ?key=value pairs from the URL
  var params   = new URLSearchParams(window.location.search);
  var city     = params.get('city')      || '';
  var checkIn  = params.get('check_in')  || '';
  var checkOut = params.get('check_out') || '';
  var guests   = params.get('guests')    || '';

  // Update the page title
  if (city) {
    titleEl.textContent = 'Hotels in ' + city;
  } else {
    titleEl.textContent = 'All Available Hotels';
  }

  // Build the subtitle string with dates and guests
  var subtitleParts = [];

  if (checkIn && checkOut) {
    var inFormatted  = formatDate(checkIn);
    var outFormatted = formatDate(checkOut);
    subtitleParts.push('Selected dates: ' + inFormatted + ' - ' + outFormatted);
  }

  if (guests) {
    subtitleParts.push(guests + ' Guest' + (guests > 1 ? 's' : ''));
  }

  if (subtitleEl && subtitleParts.length > 0) {
    subtitleEl.textContent = subtitleParts.join(' · ');
  }
}

/* =============================================================
   HELPER: formatDate
   Converts "2024-10-24" (ISO format) to "Oct 24" (readable format)
============================================================= */
function formatDate(isoString) {
  var date    = new Date(isoString + 'T00:00:00'); // avoid timezone issues
  var months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[date.getMonth()] + ' ' + date.getDate();
}

/* =============================================================
   FUNCTION: initPriceSlider
   Makes the price range slider on search-results.html
   update the displayed "$500" label as the user drags it.
============================================================= */
function initPriceSlider() {
  var slider  = document.getElementById('priceRange');
  var maxLabel = document.getElementById('priceMax');
  if (!slider || !maxLabel) return;

  slider.addEventListener('input', function () {
    maxLabel.textContent = '$' + this.value;
  });
}

/* =============================================================
   FUNCTION: initWishlistButtons
   Toggles the heart icon between outlined and filled
   when the user clicks the wishlist button on a hotel card.
============================================================= */
function initWishlistButtons() {
  // querySelectorAll finds ALL wishlist buttons on the page
  var buttons = document.querySelectorAll('.wishlist-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // don't follow any link parent

      var icon = this.querySelector('i');
      if (!icon) return;

      // Toggle between fa-regular (outlined) and fa-solid (filled red heart)
      if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        this.style.color = '#DC2626'; // red
        this.title = 'Remove from wishlist';
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        this.style.color = '';        // back to default gray
        this.title = 'Save to wishlist';
      }
    });
  });
}