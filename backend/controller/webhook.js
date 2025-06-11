import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import purchaseModel from "../models/purchaseModel.js";
import courseModel from "../models/courseModel.js";

export const clerkWebHook = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString();
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers); // this gives you parsed event directly
    const { data, type } = evt;

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
        return res
          .status(200)
          .json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      })

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await purchaseModel.findById(purchaseId);
      const userData = await userModel.findById(purchaseData.userId);
      const courseData = await courseModel.findById(purchaseData.courseId.toString());

      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = 'completed'
      await purchaseData.save();

      break;
    
    }
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

       const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      })

       const { purchaseId } = session.data[0].metadata;

      const purchaseData = await purchaseModel.findById(purchaseId);

      purchaseData.status = 'failed'
      await purchaseData.save();

    
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});

};
