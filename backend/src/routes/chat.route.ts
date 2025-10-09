import { createChat, deleteChat, getChat, getChats } from "../controllers/chatController";
import authMiddleware from "../middleware/auth";
import express, { Request, Response } from "express";

const chat = express.Router();

chat.use(authMiddleware);

chat.get("/", async (req: Request, res: Response) => {
    await getChats(req, res);
}
)

chat.post('/', async (req: Request, res: Response) => {
    await createChat(req, res);
}
);

chat.get('/:id', async (req: Request, res: Response) => {
    await getChat(req, res);
}
);

chat.delete('/:id', async (req: Request, res: Response) => {
    await deleteChat(req, res);
}
);

export default chat;