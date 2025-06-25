const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const db = require("../db");
=======
const db = require("../db"); // adjust path if needed
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

// Signup route
router.post("/signup", async (req, res) => {
<<<<<<< HEAD
=======
  //console.log("signup data:", req.body);
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
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

    // Use consistent token payload
    const tokenPayload = { id: user.id, email: user.email, mobile: user.mobile };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ error: "Mobile and password are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE mobile = $1", [
      mobile,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const tokenPayload = { id: user.id, email: user.email, mobile: user.mobile };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    }});
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
