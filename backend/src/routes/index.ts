import express from "express";
import auth from "./auth.route";
import message from "./message.route";

const router = express.Router();

router.use("/auth", auth);
router.use("/message", message);

export default router;