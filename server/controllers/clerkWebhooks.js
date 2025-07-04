import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    console.log("📩 Incoming webhook from Clerk");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ Verify and decode payload (already parsed object)
    const { data, type } = whook.verify(req.body, headers);

    console.log("✅ Event received:", type);
    console.log("📦 User data:", data);

    // Prepare user data to save to MongoDB
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ User created in MongoDB:", userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("🔁 User updated in MongoDB:", userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("❌ User deleted from MongoDB:", data.id);
        break;

      default:
        console.log("⚠️ Unhandled event type:", type);
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
