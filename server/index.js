const express = require("express");
const { connectDB } = require("./db/db");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const productRoutes = require("./routers/productRoutes");
const authRoutes = require("./routers/authRoutes");
const recipeRoutes = require("./routers/Recipe");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS - MUST BE BEFORE OTHER MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartglobal-w1ni.vercel.app",
      "https://www.smartglobal.co.ke",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ✅ Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ✅ Prevent NoSQL Injection
app.use(mongoSanitize());

// ✅ Body Parser Middleware - INCREASED LIMITS FOR BASE64 IMAGES
app.use(express.json({ limit: "50mb" })); // Increased from 10mb to 50mb
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increased from 10mb to 50mb

// ✅ Request Logger (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartGlobal API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/smartglobal/auth",
      products: "/smartglobal/products",
    },
  });
});

// ✅ API Routes
app.use("/smartglobal/auth", authRoutes);
app.use("/smartglobal/products", productRoutes);
app.use("/smartglobal/recipes", recipeRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  // Handle specific errors
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "File too large. Please use an image under 10MB.",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ✅ Connect to Database & Start Server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📦 Auth API: http://localhost:${PORT}/smartglobal/auth`);
      console.log(
        `📦 Products API: http://localhost:${PORT}/smartglobal/products`,
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", error);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// ✅ Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥", err);
  process.exit(1);
});
