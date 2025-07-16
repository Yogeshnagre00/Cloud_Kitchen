require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// ✅ Allowed frontend origins for different environments
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",      // local dev
  "http://43.201.28.251:5173",                              // QA
  "https://your-production-site.com"                        // Production (replace this)
];

// ✅ Dynamic CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Log DB connection
db.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ DB Error:", err.message);
  } else {
    console.log("✅ DB connected at:", result.rows[0].now);
  }
});

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Public route: Get products
app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Protected route: User profile
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Home route
app.get("/", (req, res) => res.send("Backend server is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔊 Server running on http://localhost:${PORT}`);
});
