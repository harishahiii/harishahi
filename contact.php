<?php
// Simple, secure contact form mailer for harishahi592@gmail.com
// No external dependencies; uses PHP's built-in mail() function.

// Prevent direct access outside POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Method not allowed');
}

// Basic anti-spam: simple honeypot field check
if (!empty($_POST['website'])) {
  http_response_code(400);
  exit('Spam detected');
}

// Sanitize and validate inputs
function clean($value) {
  return htmlspecialchars(trim($value ?? ''), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');

$errors = [];

if (empty($name))    $errors[] = 'Name is required.';
if (empty($email))   $errors[] = 'Email is required.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email address.';
if (empty($subject)) $errors[] = 'Subject is required.';
if (empty($message)) $errors[] = 'Message is required.';
if (strlen($message) < 10) $errors[] = 'Message must be at least 10 characters.';

if (!empty($errors)) {
  http_response_code(400);
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
  exit;
}

// Prepare email
$to = 'harishahi592@gmail.com';
$subject = "[Portfolio Contact] $subject";

// Email body
$body = "You have a new message from your portfolio contact form.\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$message\n\n";
$body .= "Sent at: " . date('Y-m-d H:i:s');

// Headers (plain text; adjust if you want HTML)
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send the email
$success = mail($to, $subject, $body, $headers);

header('Content-Type: application/json');
if ($success) {
  echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Failed to send message. Please try again later.']);
}
?>
