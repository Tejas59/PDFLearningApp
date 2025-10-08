import express from "express";
import auth from "./auth.route";
import message from "./message.route";
import quiz from "./quiz.route";

const router = express.Router();

router.use("/auth", auth);
router.use("/message", message);
router.use("/quiz", quiz);

export default router;