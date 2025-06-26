const express = require("express");
const Joi = require("joi");
const db = require("../db");
const router = express.Router();

// Order validation schema
const orderSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(100).required(),
  mobile: Joi.string().pattern(/^[0-9]{10,20}$/).required(),
  address: Joi.string().min(10).required(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        qty: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
  total_price: Joi.number().precision(2).positive().required(),
  user_id: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid("Placed", "Preparing", "Out for Delivery", "Delivered")
    .default("Placed"),
});


// GET /api/orders - Fetch all orders
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders ORDER BY id DESC");
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});


// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    const { error, value } = orderSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log("Validation errors:", error.details);
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => ({
          field: d.path[0],
          message: d.message,
        })),
      });
    }

    const orderData = {
      name: value.name,
      email: value.email,
      mobile: value.mobile,
      address: value.address,
      items: value.items,
      total_price: value.total_price,
      user_id: value.user_id || null,
      status: value.status,
    };

    const result = await db.query(
      `INSERT INTO orders (
        name, email, mobile, address, items, total_price, user_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        orderData.name,
        orderData.email,
        orderData.mobile,
        orderData.address,
        JSON.stringify(orderData.items),
        orderData.total_price,
        orderData.user_id,
        orderData.status,
      ]
    );

    return res.status(201).json({
      success: true,
      order: result.rows[0],
    });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({
      message: "Order processing failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});
router.put("/:orderId/status", async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  const allowedStatuses = [
    "Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await db.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
