const express = require("express");
const db = require("../db"); // PostgreSQL pool/connection
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  const { name, email, mobile, address, items, totalPrice } = req.body;

  if (!name || !email || !mobile || !address || !items || !totalPrice) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const orderResult = await db.query(
      "INSERT INTO orders (name, email, mobile, address, items, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, mobile, address, JSON.stringify(items), totalPrice]
    );
    res.status(201).json({ message: "Order saved successfully", order: orderResult.rows[0] });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

// Get all orders (admin view)
router.get("/", async (req, res) => {
  try {
    const orders = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(orders.rows);
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
