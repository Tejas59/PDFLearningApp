import { handleSendMessage } from "@/controllers/sendMessageController";
import express , { Request, Response } from "express";
import multer from "multer";

const message = express.Router();
const upload = multer({ dest: "uploads/" });

message.post("/", upload.single("file"), async (req: Request, res: Response) => {
    console.log("File:", req?.file); 
    await handleSendMessage(req, res);
});

export default message;