<?php
// config.php

// Database credentials
$host = 'localhost';
$username = "aimlcmhk_RF";
$password = "Research@123";
$database = "aimlcmhk_BPRF";

// // Database credentials
// $host = 'localhost';
// $username = "root";
// $password = "root";
// $database = "aimlcmhk_BPRF";

// Create database connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>