<?php
session_start();
require_once __DIR__ . '/config.php';

$hotel_id = isset($_GET['hotel_id']) ? intval($_GET['hotel_id']) : 1;

// Handle review submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit') {
    if (!isset($_SESSION['user_id'])) {
        header('Location: ../login.html');
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $h_id    = intval($_POST['hotel_id']);
    $rating  = intval($_POST['rating']);
    $comment = trim($_POST['comment']);

    // Check if user already reviewed this hotel
    $check = $pdo->prepare("SELECT id FROM reviews WHERE user_id = ? AND hotel_id = ?");
    $check->execute([$user_id, $h_id]);
    if ($check->fetch()) {
        header("Location: ../reviews_page.php?hotel_id=$h_id&error=already_reviewed");
        exit;
    }

    // Check if user actually stayed at this hotel
    $stay = $pdo->prepare("
        SELECT b.id FROM bookings b
        JOIN rooms r ON r.id = b.room_id
        WHERE b.user_id = ? AND r.hotel_id = ? AND b.check_out < CURDATE()
    ");
    $stay->execute([$user_id, $h_id]);
    if (!$stay->fetch()) {
        header("Location: ../reviews_page.php?hotel_id=$h_id&error=not_stayed");
        exit;
    }

    $ins = $pdo->prepare("INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES (?, ?, ?, ?)");
    $ins->execute([$user_id, $h_id, $rating, $comment]);
    header("Location: ../reviews_page.php?hotel_id=$h_id&success=1");
    exit;
}

// Fetch hotel info + avg rating
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

// Fetch all reviews for this hotel
$rev = $pdo->prepare("
    SELECT u.name AS user_name, r.rating, r.comment, r.created_at
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.hotel_id = ?
    ORDER BY r.created_at DESC
    LIMIT 4
");
$rev->execute([$hotel_id]);
$reviews = $rev->fetchAll(PDO::FETCH_ASSOC);

$recommend_pct = 0;
if ($hotel['review_count'] > 0) {
    $pos = $pdo->prepare("SELECT COUNT(*) FROM reviews WHERE hotel_id = ? AND rating >= 4");
    $pos->execute([$hotel_id]);
    $recommend_pct = intdiv((int)$pos->fetchColumn() * 100, (int)$hotel['review_count']);
}

$can_review     = false;
$already_reviewed = false;
$has_stayed     = false;

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $chk = $pdo->prepare("SELECT id FROM reviews WHERE user_id = ? AND hotel_id = ?");
    $chk->execute([$user_id, $hotel_id]);
    $already_reviewed = (bool) $chk->fetch();

    $stay = $pdo->prepare("
        SELECT b.id, b.check_in, b.check_out, r.name AS room_name
        FROM bookings b
        JOIN rooms r ON r.id = b.room_id
        WHERE b.user_id = ? AND r.hotel_id = ? AND b.check_out < CURDATE()
        ORDER BY b.check_out DESC
    ");
    $stay->execute([$user_id, $hotel_id]);
    $past_stays = $stay->fetchAll(PDO::FETCH_ASSOC);
    $has_stayed = !empty($past_stays);

    $can_review = $has_stayed && !$already_reviewed;
}