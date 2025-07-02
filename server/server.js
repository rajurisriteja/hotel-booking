import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app=express();
app.use(cors());//Enable Cross-Origin Resource Sharing

//Middleware


//API to listen to Clerk Webhooks
app.use("/api/clerk",express.raw({type:"application/json"}));
app.post("/api/clerk",clerkWebhooks);

app.use(express.json());

app.get('/',(req,res)=>res.send("API is working"));

const PORT=process.env.PORT ||  3000;

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));

