// const express = require("express");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const db = require("../Database/dbConnection");
// const router = express.Router();

// // Email configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Resend OTP
// router.post("/resend-otp", (req, res) => {
//   const { email } = req.body;

//   // Debugging statements
//   console.log("Received OTP resend request with data:", req.body);

//   if (!email) {
//     console.error("Email is required:", { email });
//     return res.status(400).send("Email is required");
//   }

//   // Check if the user exists and retrieve the current OTP expiration time
//   const checkUserQuery = "SELECT otp_expires FROM users WHERE email = ?";
//   db.query(checkUserQuery, [email], (err, results) => {
//     if (err) {
//       console.error("Database error during OTP check:", err);
//       return res.status(500).send("Database error");
//     }
//     if (results.length === 0) {
//       console.warn("User does not exist:", { email });
//       return res.status(400).send("User does not exist");
//     }

//     const currentOtpExpires = results[0].otp_expires;
//     if (currentOtpExpires && new Date(currentOtpExpires) > new Date()) {
//       console.warn("OTP has not expired yet:", { email, currentOtpExpires });
//       return res
//         .status(400)
//         .send(
//           "OTP has not expired yet. Please wait until the current OTP expires."
//         );
//     }

//     // Generate new OTP
//     const otp = crypto.randomInt(100000, 999999);
//     const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes from now

//     // Update the user's OTP and expiration time in the database
//     const updateQuery =
//       "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?";
//     db.query(updateQuery, [otp, otpExpires, email], (err, result) => {
//       if (err) {
//         console.error("Database error during OTP update:", err);
//         return res.status(500).send("Database error");
//       }

//       // Send new OTP email
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "New OTP for Email Verification",
//         text: `Your new OTP code is ${otp}. It is valid for 10 minutes.`,
//       };

//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//           console.error("Error sending new OTP email:", err);
//           return res.status(500).send("Error sending OTP email");
//         }
//         res.status(200).send("A new OTP has been sent to your email.");
//       });
//     });
//   });
// });

// module.exports = router;
