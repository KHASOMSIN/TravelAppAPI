const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../database");
const router = express.Router();

// Replace these with your actual email credentials
const EMAIL_USER = "khasomsin@gmail.com";
const EMAIL_PASS = "vxtf ondu fdla rfwa";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER, // Use hardcoded email
    pass: EMAIL_PASS, // Use hardcoded app password
  },
});

// Forgot Password (Request Password Reset)
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      status: 400,
    });
  }

  // Check if the user exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Database error",
        status: 500,
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        message: "User does not exist",
        status: 400,
      });
    }

    // Generate OTP and password token
    const otp = crypto.randomInt(1000, 9999); // 4-digit OTP for consistency
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes from now
    const passwordToken = crypto.randomBytes(16).toString("hex");

    // Update the user's OTP, expiration time, and password token in the database
    const updateQuery =
      "UPDATE users SET otp = ?, otp_expires = ?, password_token = ? WHERE email = ?";
    db.query(
      updateQuery,
      [otp, otpExpires, passwordToken, email],
      (err, result) => {
        if (err) {
          console.error("Database error during OTP update:", err);
          return res.status(500).json({
            message: "Database error",
            status: 500,
          });
        }

        // Send OTP email
        const mailOptions = {
          from: EMAIL_USER, // Use hardcoded email
          to: email,
          subject: "Password Reset OTP",
          text: `Your OTP code for password reset is ${otp}. It is valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending OTP email:", err.message);
            console.error("SMTP response:", err.response);
            return res.status(500).json({
              message: "Error sending OTP email",
              status: 500,
            });
          }
          res.status(200).json({
            message: "success",
            status: 200,
            data: {
              forgot_password: {
                message: "OTP code sent successfully, Please check your email",
                expires_at: otpExpires.toISOString(),
                password_token: passwordToken,
                otp_code: otp, // Include the OTP code in the response
              },
            },
          });
        });
      }
    );
  });
});

module.exports = router;
