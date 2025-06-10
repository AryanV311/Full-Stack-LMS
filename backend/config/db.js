import mongoose from "mongoose";

const connectDb = async() => {
    const URI = process.env.MONGO_URI
    try {
        await mongoose.connect(URI)
        console.log("Database Connected")
    } catch (error) {
        console.log("Db Connection failed!");
    }
}

export default connectDb;