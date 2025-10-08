import express from "express";
import auth from "./auth.route";
import message from "./message.route";
import quiz from "./quiz.route";
import chat from "./chat.route";
import conversation from "./conversation.route";

const router = express.Router();

router.use("/auth", auth);
router.use("/message", message);
router.use("/quiz", quiz);
router.use("/chat", chat);
router.use("/conversation", conversation);

export default router;