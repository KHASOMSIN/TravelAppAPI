require("dotenv").config(); // Load environment variables

const express = require("express");
const bodyParser = require("body-parser");
const userRegister = require("./Authentications/user_register");
const userLogin = require("./Authentications/user_login");
const resetPassword = require("./Authentications/resetPassword");
const forgotPassword = require("./Authentications/forgetPassword");
const confirmOtp = require("./Authentications/confirmOtp");
const createProfiles = require("./user profiles/user_profile");
const getUser = require("./user profiles/get_userprofile");
const pool = require("./database");

require("./Database/dbConnection"); // Database connection

const app = express();

// Middleware
app.use(bodyParser.json());

// Route Setup
app.use("/api/khasin/", userRegister); // User Registration routes
app.use("/api/khasin/", userLogin); // User Login routes
app.use("/api/khasin/", resetPassword); // Password reset routes
app.use("/api/khasin/", forgotPassword); // Forgot password routes
app.use("/api/khasin/", confirmOtp); // OTP confirmation routes
app.use("/api/khasin/", createProfiles); // User profile creation routes
app.use("/api/khasin/", getUser); // Get user profile routes

module.exports = app;
