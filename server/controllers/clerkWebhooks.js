import getRawBody from "raw-body";
import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const payload = await getRawBody(req); // raw buffer
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ Verify with raw payload
    const evt = wh.verify(payload, headers);

    const { data, type } = evt; // now safe to use

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    console.log("📥 Type:", type);
    console.log("📦 User Data:", userData);

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ User created");
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User updated");
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted");
        break;
      default:
        console.log("⚠️ Unknown event type:", type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
