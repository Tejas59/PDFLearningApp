import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`);
        console.log(`✅ MongoDB connected: ${process.env.DB_NAME}`);
    } catch (err: unknown) {
        const error = err as Error;
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;