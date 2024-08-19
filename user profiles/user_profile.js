const express = require("express");
const db = require("../Database/dbConnection");
const router = express.Router();
const cloudinary = require("cloudinary").v2; // Use v2 directly

cloudinary.config({
  cloud_name: "doaxvtpre",
  api_key: "124993626555596",
  api_secret: "8wTrTbldLiK142HTJO9OZrZqfnE",
  secure: true,
});

// Create or update user profile
router.post("/user/profile", (req, res) => {
  const { user_id, gender, dob, profile_image } = req.body;

  // Input validation
  if (!user_id) {
    return res.status(400).send("User ID is required");
  }

  // Handle image upload if profile_image is provided
  if (profile_image) {
    cloudinary.uploader.upload(profile_image, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).send("Failed to upload image");
      }

      const imageUrl = result.secure_url; // Get the secure URL from Cloudinary

      // Proceed to create or update the profile
      upsertUserProfile(user_id, gender, dob, imageUrl, res);
    });
  } else {
    // If no image provided, proceed with other data
    upsertUserProfile(user_id, gender, dob, null, res);
  }
});

// Function to handle profile upsert (update or insert)
function upsertUserProfile(user_id, gender, dob, profile_image, res) {
  // Query to check if profile already exists
  const checkProfileQuery = "SELECT * FROM user_profiles WHERE user_id = ?";

  db.query(checkProfileQuery, [user_id], (err, results) => {
    if (err) {
      console.error("Database error during profile check:", err);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      // Profile exists, update it
      const updateProfileQuery = `
        UPDATE user_profiles
        SET gender = ?, dob = ?, profile_image = ?
        WHERE user_id = ?
      `;
      db.query(
        updateProfileQuery,
        [gender, dob, profile_image || results[0].profile_image, user_id],
        (err) => {
          if (err) {
            console.error("Database error during profile update:", err);
            return res.status(500).send("Database error");
          }
          return res.status(200).send("Profile updated successfully");
        }
      );
    } else {
      // Profile does not exist, create it
      const createProfileQuery = `
        INSERT INTO user_profiles (user_id, gender, dob, profile_image)
        VALUES (?, ?, ?, ?)
      `;
      db.query(
        createProfileQuery,
        [user_id, gender, dob, profile_image],
        (err) => {
          if (err) {
            console.error("Database error during profile creation:", err);
            return res.status(500).send("Database error");
          }
          return res.status(201).send("Profile created successfully");
        }
      );
    }
  });
}

module.exports = router;
