<?php require_once 'php/reviews.php'; ?>

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
        <a href="reviews_page.php" class="active">Reviews</a>
        <a href="about.html">About us</a>
      </div>
      <div class="nav-auth">
        <a href="dashboard.php" class="profile-icon"><i class="fa-regular fa-circle-user"></i><?php if (!empty($_SESSION['user_name'])): ?> <span class="nav-user"><?= htmlspecialchars($_SESSION['user_name']) ?></span><?php endif; ?></a>
      </div>
    </div>
  </nav>

  <main class="reviews-container">

    <section class="hotel-header">
  <div class="hotel-info">
    <h2><?= htmlspecialchars($hotel['name']) ?></h2>
    <p class="rating">
      <i class="fa-solid fa-star"></i> <?= $hotel['avg_rating'] ?? 'N/A' ?> / 5 · Based on
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

        <?php if (empty($reviews)): ?>
          <p>No reviews yet. Be the first to review!</p>
        <?php else: ?>
          <div class="review-card big">
            <h3><?= htmlspecialchars($reviews[0]['user_name']) ?></h3>
            <div class="stars"><?= str_repeat('★', $reviews[0]['rating']) . str_repeat('☆', 5 - $reviews[0]['rating']) ?></div>
            <p><?= htmlspecialchars($reviews[0]['comment']) ?></p>
          </div>

          <div class="review-grid">
            <?php for ($i = 1; $i < count($reviews); $i++): ?>
              <div class="review-card small">
                <h4><?= htmlspecialchars($reviews[$i]['user_name']) ?></h4>
                <div class="stars"><?= str_repeat('★', $reviews[$i]['rating']) . str_repeat('☆', 5 - $reviews[$i]['rating']) ?></div>
              </div>
            <?php endfor; ?>
          </div>
        <?php endif; ?>

        <div class="form-card">
          <h2>Share Your Experience</h2>

          <?php if (!isset($_SESSION['user_id'])): ?>
            <p>You must <a href="login.html">log in</a> to leave a review.</p>

          <?php elseif ($already_reviewed): ?>
            <p>You have already reviewed this hotel.</p>

          <?php elseif (!$has_stayed): ?>
            <p>You can only review hotels you have stayed at.</p>

          <?php else: ?>
            <form action="php/reviews.php?action=submit" method="POST">
              <input type="hidden" name="action" value="submit">
              <input type="hidden" name="hotel_id" value="<?= $hotel['id'] ?>">

              <label>Which stay are you reviewing?</label>
              <select name="booking_id" required>
                <option value="">Select a stay</option>
                <?php foreach ($past_stays as $s): ?>
                  <option value="<?= $s['id'] ?>">
                    <?= htmlspecialchars($s['room_name']) ?> : <?= $s['check_in'] ?> to <?= $s['check_out'] ?>
                  </option>
                <?php endforeach; ?>
              </select>

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
          <?php endif; ?>
        </div>

      </div>

      <div class="reviews-right">
        <div class="recommend-card">
          <h3>Highly Recommended</h3>
          <p><?= $recommend_pct ?>% of guests recommend this hotel.</p>
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
        <a href="#">Help Center</a>
        <a href="#">Partners</a>
      </div>
      <p class="footer-copy">© 2024 StayEase Inc. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>