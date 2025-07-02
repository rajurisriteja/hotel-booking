import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import bodyParser from "body-parser"; // ✅ Needed for raw body parsing

connectDB();

const app = express();
app.use(cors());

// ✅ Apply raw body only for /api/clerk route
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "*/*" }), // Clerk needs raw body
  clerkWebhooks
);

// ✅ Apply express.json AFTER webhook route
app.use(express.json());
app.use(clerkMiddleware());

// ✅ Add other routes
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
