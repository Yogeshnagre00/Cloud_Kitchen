const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // adjust path if needed

const router = express.Router();



// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, mobile, password, address } = req.body;

  if (!name || !email || !mobile || !password || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1 OR mobile = $2",
      [email, mobile]
    );

    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];
      if (existingUser.email === email && existingUser.mobile === mobile) {
        return res
          .status(409)
          .json({ error: "Email and Mobile already registered" });
      } else if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already registered" });
      } else {
        return res
          .status(409)
          .json({ error: "Mobile number already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, mobile, password, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, mobile, address",
      [name, email, mobile, hashedPassword, address]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, ...user });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});


// Login route (with mobile instead of email)
router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE mobile = $1", [
      mobile,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, mobile: user.mobile },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;