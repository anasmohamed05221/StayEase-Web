<?php
require_once 'config.php';

$hotel_id = isset($_GET['hotel_id']) ? intval($_GET['hotel_id']) : 1;

$stmt = $pdo->prepare("
    SELECT h.id, h.name, h.image,
           ROUND(AVG(r.rating), 1) AS avg_rating,
           COUNT(r.id) AS review_count
    FROM hotels h
    LEFT JOIN reviews r ON r.hotel_id = h.id
    WHERE h.id = ?
    GROUP BY h.id
");
$stmt->execute([$hotel_id]);
$hotel = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>StayEase. Reviews</title>

  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/reviews.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>

  <nav class="navbar">
    <div class="container nav-inner">
      <a href="index.php" class="logo">StayEase<span>.</span></a>
      <div class="nav-links">
        <a href="index.php">Home</a>
        <a href="search-results.php">Discover</a>
        <a href="about.html">About</a>
        <a href="reviews.html" class="active">Reviews</a>
      </div>
      <div class="nav-auth">
        <a href="dashboard.html" class="profile-icon"><i class="fa-regular fa-circle-user"></i></a>
        <a href="login.html" class="btn-login">Login</a>
      </div>
    </div>
  </nav>

  <main class="reviews-container">

    <section class="hotel-header">
  <div class="hotel-info">
    <h2><?= htmlspecialchars($hotel['name']) ?></h2>
    <p class="rating">
      ⭐ <?= $hotel['avg_rating'] ?? 'N/A' ?> / 5 · Based on
      <?= $hotel['review_count'] ?> review<?= $hotel['review_count'] != 1 ? 's' : '' ?>
    </p>
  </div>

  <img 
    src="<?= htmlspecialchars($hotel['image']) ?>" 
    class="hotel-img" 
    alt="<?= htmlspecialchars($hotel['name']) ?>"
  >
</section>
    <div class="reviews-layout">

      <div class="reviews-left">

        <div class="review-card big">
          <h3>Sarah Ahmed</h3>
          <div class="stars">★★★★★</div>
          <p>
            Amazing experience! The service was excellent and the rooms were very clean.
          </p>
        </div>

        <div class="review-grid">
          <div class="review-card small">
            <h4>Great Stay</h4>
            <div class="stars">★★★★★</div>
          </div>

          <div class="review-card small">
            <h4>Loved It</h4>
            <div class="stars">★★★★☆</div>
          </div>

          <div class="review-card small">
            <h4>Very Clean</h4>
            <div class="stars">★★★★★</div>
          </div>
        </div>

        <div class="form-card">
          <h2>Share Your Experience</h2>

          <form action="php/reviews.php?action=submit" method="POST">
    <input type="hidden" name="hotel_id" value="<?= $hotel['id'] ?>">

            <label>Your Rating</label>
            <select name="rating" required>
              <option value="">Choose rating</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>

            <label>Your Review</label>
            <textarea name="comment" placeholder="Tell us about your stay..." required></textarea>

            <button type="submit">Submit Review</button>
          </form>
        </div>

      </div>

      <div class="reviews-right">
        <div class="recommend-card">
          <h3>Highly Recommended</h3>
          <p>95% of guests recommend this hotel.</p>
        </div>
      </div>

    </div>

  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-logo">StayEase</div>
      <div class="footer-links">
        <a href="about.html">About Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Partners</a>
      </div>
      <p class="footer-copy">© 2024 StayEase Inc. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>