import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Your existing files
import getCohereResponse from "./utils/getCohereResponse.js";
import chatRoutes from "./routes/chat.js";

import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
  }
};

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.userId}` });
});

// For testing Cohere
app.post("/ask", async (req, res) => {
  const { message } = req.body;
  const reply = await getCohereResponse(message);
  res.json({ reply });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  connectDB();
});
