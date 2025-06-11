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

const app = express();

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
await connectCloudinary();


app.get('/', (req, res) => {
    res.send("Api working");
}); 

app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHook)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHook)


await connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
