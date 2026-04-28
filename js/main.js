/* =============================================================
   js/main.js — StayEase Frontend JavaScript
   Member 2: Mohamed Gamil

   This file handles:
   1. Search form date validation (check-out must be after check-in)
   2. Auto-filling today's date as the minimum selectable date
   3. Reading URL params to display the search summary on results page
   4. Price range slider live update
   5. Wishlist heart toggle
   6. Dynamic night-count label on result cards (computed from URL dates)
   ============================================================= */

// ── 1. Run everything after the HTML is fully loaded ──────────────────────
document.addEventListener('DOMContentLoaded', function () {

  setMinDates();
  initSearchValidation();
  initResultsPageHeader();
  initPriceSlider();
  initWishlistButtons();
  initSortRedirect();

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

    // Validate that city is not empty — checked first so it's obvious to the user
    var cityInput = document.getElementById('city');
    if (cityInput && cityInput.value.trim() === '') {
      e.preventDefault();
      cityInput.focus();
      cityInput.style.outline = '2px solid #DC2626';
      setTimeout(function () { cityInput.style.outline = ''; }, 2000);
      return;
    }

    // Only validate dates if both are filled in
    if (checkIn && checkOut && checkIn.value && checkOut.value) {
      var inDate  = new Date(checkIn.value);
      var outDate = new Date(checkOut.value);

      // check-out must be STRICTLY after check-in
      if (outDate <= inDate) {
        e.preventDefault(); // stop the form from sending

        // Show the error message (CSS makes it visible via .visible class)
        if (errorEl) errorEl.classList.add('visible');

        // Highlight the search bar border to draw attention
        var searchBox = document.querySelector('.search-box');
        if (searchBox) {
          searchBox.style.border = '2px solid #DC2626';
          setTimeout(function () {
            searchBox.style.border = '';
          }, 2000);
        }

        return; // stop here
      }
    }
  });
}

/* =============================================================
   FUNCTION: initResultsPageHeader
   Reads the URL parameters on the search-results page and:
     1. Updates the h1 with the destination city
     2. Updates the subtitle with dates and guest count
     3. FIXED: Computes the number of nights from check_in & check_out
        and updates the "Price for X nights" labels on placeholder cards.
        (When PHP is connected, this is handled server-side with DATEDIFF.)

   Example URL: search-results.html?city=London&check_in=2024-10-24&check_out=2024-10-28
   Displays: "Hotels in London"
             "Selected dates: Oct 24 - Oct 28 · 4 nights"
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
  titleEl.textContent = city ? 'Hotels in ' + city : 'All Available Hotels';

  // ── Compute number of nights ─────────────────────────────────────────
  // FIXED: was hardcoded as "4 nights" in the original HTML.
  // Now calculated from the actual URL dates so it matches what the user chose.
  var nights = null;
  if (checkIn && checkOut) {
    var inDate  = new Date(checkIn  + 'T00:00:00');
    var outDate = new Date(checkOut + 'T00:00:00');
    var diff    = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (diff > 0) nights = diff;
  }

  // Update placeholder card "Price for X nights" labels (used before PHP is connected)
  if (nights !== null) {
    var nightLabel = 'Price for ' + nights + ' night' + (nights > 1 ? 's' : '');
    ['nightLabel1', 'nightLabel2', 'nightLabel3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = nightLabel;
    });
  }

  // ── Build subtitle ───────────────────────────────────────────────────
  var subtitleParts = [];

  if (checkIn && checkOut) {
    subtitleParts.push('Selected dates: ' + formatDate(checkIn) + ' - ' + formatDate(checkOut));
  }

  if (nights !== null) {
    subtitleParts.push(nights + ' night' + (nights > 1 ? 's' : ''));
  }

  if (guests) {
    subtitleParts.push(guests + ' Guest' + (parseInt(guests, 10) > 1 ? 's' : ''));
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
  var date   = new Date(isoString + 'T00:00:00'); // avoid timezone shift
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[date.getMonth()] + ' ' + date.getDate();
}

/* =============================================================
   FUNCTION: initPriceSlider
   Makes the price range slider on search-results.html
   update the displayed "$500" label as the user drags it.
============================================================= */
function initPriceSlider() {
  var slider   = document.getElementById('priceRange');
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
  var buttons = document.querySelectorAll('.wishlist-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // don't follow any link parent
      e.stopPropagation(); // don't trigger card click

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
        this.style.color = ''; // back to default
        this.title = 'Save to wishlist';
      }
    });
  });
}

/* =============================================================
   FUNCTION: initSortRedirect
   When the user changes the "Sort by" dropdown on the results page,
   re-submit the current URL with the updated sort parameter so
   search.php can re-run the query with the correct ORDER BY.
   FIXED: "popularity" option was removed — it had no matching DB column.
============================================================= */
function initSortRedirect() {
  var sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;

  // Pre-select the option that matches the current URL param
  var params      = new URLSearchParams(window.location.search);
  var currentSort = params.get('sort') || '';
  if (currentSort) {
    sortSelect.value = currentSort; // highlights the active option
  }

  sortSelect.addEventListener('change', function () {
    params.set('sort', this.value);
    window.location.search = params.toString(); // reload with new sort
  });
}