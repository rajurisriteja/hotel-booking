import User from "../models/User.js";    
import { Webhook } from "svix";

const clerkWebhooks=async(req,res)=>{
    try {
        //Create a Svix instance with clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Getting Headers
        const headers={
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        };

        //Verifying Headers
        await whook.verify(JSON.stringify(req.body),headers)

        //Getting Data from request body
        const {data,type}=req.body

        const userData={
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name+" "+data.last_name,
            image:data.image_url,
        }
        console.log("📥 Type:", type);
        console.log("📦 User Data:", userData);
        //Switch cases for different events 
        switch (type) {
            case "user.created":{
                await User.create(userData);
                console.log("✅ User created");
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(data.id,userData);
                console.log("✅ User updated");
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                console.log("✅ User deleted");
                break;
            }
            
            default:
                console.log("⚠️ Unknown event type:", type);
        }
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export default clerkWebhooks;