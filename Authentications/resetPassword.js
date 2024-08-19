const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../Database/dbConnection");
const router = express.Router();
const saltRounds = 10;

// Reset Password (Using Password Token)
router.post("/reset-password", (req, res) => {
  const { password, password_confirmation, password_token } = req.body;

  if (!password || !password_confirmation || !password_token) {
    return res.status(400).json({
      message:
        "Password, password confirmation, and password token are required",
      status: 400,
    });
  }

  if (password !== password_confirmation) {
    return res.status(400).json({
      message: "Passwords do not match",
      status: 400,
    });
  }

  // Check if the password token is valid
  const query =
    "SELECT * FROM users WHERE password_token = ? AND otp_expires > NOW()";
  db.query(query, [password_token], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
        status: 500,
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        message: "Invalid password token or token has expired",
        status: 400,
      });
    }

    // Hash the new password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error hashing password",
          status: 500,
        });
      }

      // Update the user's password and clear the OTP and password token
      const updateQuery =
        "UPDATE users SET password = ?, otp = NULL, otp_expires = NULL, password_token = NULL WHERE password_token = ?";
      db.query(updateQuery, [hashedPassword, password_token], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error",
            status: 500,
          });
        }
        res.status(200).json({
          message: "Password has been reset successfully",
          status: 200,
        });
      });
    });
  });
});

module.exports = router;
