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
  $amount = $conn->real_escape_string($_POST["amount"]);
  $currency = $conn->real_escape_string($_POST["currency"]);

  // Insert into database
  $sql = "INSERT INTO donations (name, phone, email, amount, currency)
          VALUES ('$name', '$phone', '$email', '$amount', '$currency')";

  if ($conn->query($sql) === TRUE) {
    echo "Thank you for initiating the donation process! We will contact you shortly to complete the transaction.";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // Close connection
  $conn->close();
}
?>