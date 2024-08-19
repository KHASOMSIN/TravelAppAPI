const mysql = require("mysql2"); // Ensure this line is present

// Create a connection pool
const pool = mysql.createPool({
  host: "sql110.infinityfree.com",
  user: "if0_37130176",
  password: "Kh23sk65k3",
  database: "if0_37130176_TravelApp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the pool with promise support
module.exports = pool.promise();
