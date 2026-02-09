import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import leadTaskRoutes from "./routes/leadTaskRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { startTaskScheduler } from "./jobs/taskScheduler.js";

const app = express();

startTaskScheduler(); // 🚀 Start the robust scheduler

const allowedOrigins = ["*"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 📂 Serve Static Files (for generated PDFs)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/masters", masterRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/lead-tasks", leadTaskRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/upload", uploadRoutes);


// Create a default admin user if none exists

app.post("/api/create-admin", async (req, res) => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const admin = await User.create({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword, // ✅ HASHED
      address: req.body.address,
      role: "admin",
      status: "active"
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
