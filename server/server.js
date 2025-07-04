import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import bodyParser from "body-parser"; // ✅ For raw body
import { clerkMiddleware } from "@clerk/express";

connectDB();

const app = express();
app.use(cors());

// ✅ Clerk webhook route first with raw body (important!)
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "*/*" }), // raw body needed for signature verification
  clerkWebhooks
);

// ✅ Apply middleware AFTER webhook route
app.use(express.json());
app.use(clerkMiddleware());

// ✅ Other routes
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
