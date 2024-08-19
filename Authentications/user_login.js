const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send("Invalid email or password");
    }

    const user = results[0];

    // Check if the user has verified their email
    if (!user.is_verified) {
      return res.status(400).json({
        message: "error",
        status: 400,
        data: {
          message: "Your account is not verified. Please verify your account.",
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });

    res.status(200).json({
      message: "success",
      status: 200,
      data: {
        jwt: {
          access_token: token,
          token_type: "bearer",
          expires_in: 3600,
        },
      },
    });
  });
});

module.exports = router;
