import { Request, Response } from "express";
import { chatModel } from "../models/chatModel";
import { conversationModel } from "@/models/conversionModel";



export const getChats = async (req: Request, res: Response) => {
    try {
        const chats = await chatModel.find({ userId: (req as any).user.id }).sort({
            updateAt: -1,
        });
        if (!chats) {
            return res.status(401).json({ error: "chats not found" });
        }
        return res.json({ chats, success: true });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const createChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id
        console.log({userId});
        const { title, description } = req.body;
        const chat = new chatModel({
            userId: userId,
            title: title || "New chatModel",
            description,
        });

        await chat.save();
        return res
            .status(201)
            .json({ chat, message: "chatModel created successfully", success: true });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const getChat = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const chat = await chatModel.findOne({ _id: id, userId: (req as any).user.id });
        if (!chat) {
            return res.status(401).json({ error: "chats not found" });
        }
        const conversation = await conversationModel.findOne({ chatId: id });

        //filter out system message
        const messages = conversation
            ? conversation.messages.filter((msg) => msg.role !== "system")
            : [];

        return res.json({
            chat,
            messages,
            message: "Conserstion get successfully",
            success: true,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const chat = await chatModel.findOne({ _id: id, userId: (req as any).user.id });

        if (!chat) {
            return res.status(401).json({ error: "chats not found" });
        }

        await chatModel.deleteOne({ _id: id });
        await conversationModel.deleteOne({ chatId: id });

        res.json({ success: true, message: "chat deleted successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};