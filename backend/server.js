import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import { clerkWebHook, stripeWebHook } from "./controller/webhook.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

const startServer = async () => {
  const app = express();

  app.use(cors());

  // Clerk and Stripe need raw payloads first
  app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHook);
  app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHook);

  // Now parse JSON for all other routes
  app.use(express.json());

  app.use(clerkMiddleware());

  await connectCloudinary();

  app.get('/', (req, res) => {
    res.send("API working 🛳️");
  });

  app.use('/api/educator', educatorRouter);
  app.use('/api/course', courseRouter);
  app.use('/api/user', userRouter);

  await connectDb();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("💥 Server failed to start:", err);
});
