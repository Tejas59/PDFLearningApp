import { getConversation, sendMessage } from "@/controllers/conversionController";
import { handleSendMessage } from "@/controllers/sendMessageController";
import authMiddleware from "@/middleware/auth";
import express, { Request, Response } from "express";

const conversation = express.Router();

conversation.use(authMiddleware);

conversation.post('/:chatId/messages', async (req: Request, res: Response) => {
    await sendMessage(req, res);
})


conversation.get('/:chatId', async (req: Request, res: Response) => {
    await getConversation(req, res);
}
)


export default conversation;