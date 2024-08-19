const express = require("express");
const db = require("../Database/dbConnection");
const router = express.Router();

// Get user profile
router.get("/user/profile/:userId", (req, res) => {
  const { userId } = req.params;

  // Query to get the user's profile
  const query = "SELECT * FROM user_profiles WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error during profile retrieval:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).send("User profile not found");
    }

    // Send the user profile as a JSON response
    const userProfile = results[0];
    res.status(200).json(userProfile);
  });
});

module.exports = router;
