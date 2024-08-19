// config/db.js
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelApp",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;

// <?php
// $servername = "sql110.infinityfree.com"; // Replace with your Database Hostname
// $username = "if0_37130176";  // Replace with your Database Username
// $password = "Kh23sk65k3";  // Replace with your Database Password
// $dbname = "if0_37130176_TravelApp";        // Replace with your Database Name

// // Create connection
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }
// echo "Connected successfully";
// ?>
