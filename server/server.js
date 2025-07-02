import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors()); // ✅ Enable CORS globally

// ✅ Only raw body for the Clerk webhook route
app.post("/api/clerk", express.raw({ type: "*/*" }), clerkWebhooks);

// ✅ Then use express.json for all other routes
app.use(express.json());

// ✅ Add other routes if needed
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
