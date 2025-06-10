import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import { clerkWebHook } from "./controller/webhook.js";

const app = express();

app.use(cors())




app.get('/', (req, res) => {
    res.send("Api working");
});

app.post('/clerk', express.json(), clerkWebHook)

connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
