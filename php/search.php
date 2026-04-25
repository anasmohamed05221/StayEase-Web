<?php
/* =============================================================
   php/search.php — Hotel Search Backend
   Member 2: Mohamed Gamil
   
   HOW IT WORKS:
   1. User fills the search form on index.html and clicks Search
   2. The form sends a GET request: php/search.php?city=Cairo&check_in=...
   3. This file reads those URL parameters using $_GET
   4. It queries the hotels table in MySQL using LIKE for partial matching
   5. It loops over the results and echoes HTML hotel cards
   6. Those cards appear inside #resultsContainer on search-results.html

   SECURITY:
   - We use PREPARED STATEMENTS (bindParam / bindValue) so user input
     is NEVER directly inserted into the SQL string.
   - This prevents SQL Injection attacks.
   - htmlspecialchars() is used when displaying data to prevent XSS attacks.
   ============================================================= */

// Step 1: Include the database connection file (written by Member 1 - Anas)
// $pdo is a PDO object that lets us talk to the MySQL database
require_once 'config.php';

// Step 2: Start session so we can check if user is logged in
session_start();

// ── Read & Sanitize GET Parameters ──────────────────────────────────────────

/*
  $_GET['city'] reads the ?city= value from the URL.
  The ?? '' means: if 'city' doesn't exist in the URL, use an empty string.
  trim() removes any accidental spaces the user may have typed.
*/
$city      = trim($_GET['city']      ?? '');
$check_in  = trim($_GET['check_in']  ?? '');
$check_out = trim($_GET['check_out'] ?? '');

// ── Build the SQL Query ──────────────────────────────────────────────────────

/*
  We use LIKE with % wildcards so searching "cai" also matches "Cairo".
  Example: LIKE '%cai%' matches → Cairo, Cai Lan, etc.

  The ? is a PLACEHOLDER — we never put $city directly in the SQL string.
  PDO will safely replace ? with the actual value to prevent SQL injection.
*/

if (!empty($city)) {
    // User searched for a specific city
    $sql  = "SELECT * FROM hotels WHERE city LIKE ? ORDER BY rating DESC";
    $stmt = $pdo->prepare($sql);

    // Wrap city with % for partial matching: "Cairo" becomes "%Cairo%"
    $searchTerm = '%' . $city . '%';

    // bindValue links the ? placeholder to $searchTerm safely
    $stmt->bindValue(1, $searchTerm, PDO::PARAM_STR);

} else {
    // No city typed → return all hotels (fallback)
    $sql  = "SELECT * FROM hotels ORDER BY rating DESC";
    $stmt = $pdo->prepare($sql);
}

// Step 3: Execute the query (actually runs it against the database)
$stmt->execute();

// Step 4: Fetch all matching rows as an associative array
// Each $hotel is like: ['id' => 1, 'name' => 'Grand Nile', 'city' => 'Cairo', ...]
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ── Step 5: Count results for the header ────────────────────────────────────
$count = count($hotels);

// ── Step 6: Output the HTML ──────────────────────────────────────────────────

/*
  htmlspecialchars() converts special characters to HTML entities.
  Example: if $city = '<script>alert(1)</script>'
  htmlspecialchars turns it into: &lt;script&gt;alert(1)&lt;/script&gt;
  This prevents XSS (Cross-Site Scripting) attacks.
*/
$safeCity = htmlspecialchars($city, ENT_QUOTES, 'UTF-8');

// Print the result count header
echo "<p style='font-size:14px; color:var(--muted); margin-bottom:24px;'>";
echo "Showing <strong>{$count}</strong> hotel" . ($count !== 1 ? 's' : '');
if (!empty($safeCity)) echo " in <strong>{$safeCity}</strong>";
echo "</p>";

// ── Step 7: Check if any results exist ──────────────────────────────────────
if ($count === 0) {

    // Empty state — no results found
    echo '
    <div class="empty-state">
      <i class="fa-solid fa-magnifying-glass"></i>
      <h3>No hotels found</h3>
      <p>We couldn\'t find any hotels in "' . $safeCity . '". Try a different city or broaden your search.</p>
    </div>';

} else {

    // Step 8: Loop through every hotel row and echo an HTML card
    foreach ($hotels as $hotel) {

        /*
          Sanitize every value before displaying it.
          Even data from your own DB should be escaped when echoing into HTML.
        */
        $id       = (int) $hotel['id'];           // cast to int — safest for IDs
        $name     = htmlspecialchars($hotel['name'],             ENT_QUOTES, 'UTF-8');
        $city_out = htmlspecialchars($hotel['city'],             ENT_QUOTES, 'UTF-8');
        $image    = htmlspecialchars($hotel['image']    ?? '',   ENT_QUOTES, 'UTF-8');
        $price    = number_format((float) $hotel['price_per_night'], 0);
        $rating   = htmlspecialchars($hotel['rating']   ?? '',   ENT_QUOTES, 'UTF-8');
        $desc     = htmlspecialchars($hotel['description'] ?? '', ENT_QUOTES, 'UTF-8');

        // Build star string based on rating (round to nearest whole number)
        $stars    = str_repeat('★', min(5, (int) round((float) $hotel['rating'])));

        // Fallback image if none stored in DB
        $imgSrc   = !empty($image) ? $image : 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80';

        // Echo one hotel result card per row
        echo "
        <div class='result-card'>
          <div class='result-card-img'>
            <img src='{$imgSrc}' alt='{$name}'>
            <button class='wishlist-btn' title='Save to wishlist'>
              <i class='fa-regular fa-heart'></i>
            </button>
          </div>
          <div class='result-card-body'>
            <div class='result-card-top'>
              <div>
                <h3>{$name}</h3>
                <p class='result-location'>
                  <i class='fa-solid fa-location-dot fa-xs'></i> {$city_out}
                </p>
                <div class='hotel-stars' style='font-size:14px; margin-bottom:4px;'>{$stars}</div>
              </div>
              <div class='score-badge'>
                <span>{$rating}</span>
                RATED
              </div>
            </div>
            <p class='result-desc'>{$desc}</p>
            <div class='result-card-bottom'>
              <div class='result-price'>
                <small>Starting from</small>
                <strong>\${$price}</strong> <span>/ night</span>
              </div>
              <a href='hotel-detail.html?id={$id}' class='btn-view'>View Deal</a>
            </div>
          </div>
        </div>";
    }
}
?>