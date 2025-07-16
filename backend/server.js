require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// 🟩 Parse env-based whitelist
const allowedOrigins = (process.env.CORS_WHITELIST || "")
  .split(",")
  .map(origin => origin.trim());

// ✅ Dynamic CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Log database connection status
db.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ DB connected:", result.rows[0].now);
  }
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Public route
app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Products fetch error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Protected route
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
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Health check
app.get("/", (req, res) => res.send("🚀 Backend server is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔊 Server running on http://localhost:${PORT}`);
});
