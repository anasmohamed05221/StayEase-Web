<?php
require_once 'config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        die("All fields are required.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email address.");
    }

    $stmt = $pdo->prepare("
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
    ");

    $stmt->execute([$name, $email, $message]);

    header("Location: ../about.html?success=1");
    exit;
}

echo "Invalid request.";
?>