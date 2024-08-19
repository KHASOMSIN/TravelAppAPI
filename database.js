require("dotenv").config(); // Load environment variables

const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("Error connecting: " + err.stack);
  }
  console.log("Connected as ID " + connection.threadId);
});

// Close the connection
connection.end();
