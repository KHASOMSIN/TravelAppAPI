const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12726739",
  password: "q5dMZkAwCk",
  database: "sql12726739",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("error connecting: " + err.stack);
  }
  console.log("connected as id " + connection.threadId);
});

// Example query
connection.query;
