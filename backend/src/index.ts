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

const APP_PORT = process.env.APP_PORT || 5000;
app.listen(APP_PORT, () => {
    console.log(`server is running on the port ${APP_PORT}`);
});