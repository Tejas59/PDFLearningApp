import express from "express";
import cors from "cors";
import routes from "./routes/index";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();

connectDB();

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use(process.env.APP_PREFIX_PATH ?? "/api", routes);

const PORT = process.env.PORT || process.env.APP_PORT || 8080;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});