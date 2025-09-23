<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database configuration
require 'config.php';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Sanitize inputs
  $name = $conn->real_escape_string($_POST["name"]);
  $phone = $conn->real_escape_string($_POST["phone"]);
  $email = $conn->real_escape_string($_POST["email"]);
  $message = $conn->real_escape_string($_POST["message"]);

  // Insert into database
  $sql = "INSERT INTO contact_form (name, phone, email, message)
          VALUES ('$name', '$phone', '$email', '$message')";

  if ($conn->query($sql) === TRUE) {
    echo "We will reach out to you via email. Thank you for contacting us!";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // Close connection
  $conn->close();
}
?>