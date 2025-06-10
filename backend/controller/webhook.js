import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebHook = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // If using express.raw middleware
    const payload = req.body.toString();
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);
    const { data, type } = JSON.parse(payload);

    console.log("Clerk Webhook Event:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await userModel.create(userData);
        return res.status(200).json({ success: true, message: "User created" });
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await userModel.findByIdAndUpdate(data.id, updatedData);
        return res.status(200).json({ success: true, message: "User updated" });
      }

      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true, message: "User deleted" });
      }

      default:
        return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};
