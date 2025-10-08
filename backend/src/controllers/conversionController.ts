import { Request, Response } from "express";
import { chatModel } from "../models/chatModel";
import { conversationModel } from "../models/conversionModel";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { model } from "@/utils/gemini";



interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;

        if (!message || !message.content) {
            return res.status(400).json({ error: "Message content is required" });
        }

        const userId = (req as any).user.id
        if (!userId) {
            return res.status(401).json({ error: "User not authorized" });
        }
        const chat = await chatModel.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ error: "chatModel not found" });
        }

        let conversation = await conversationModel.findOne({ chatId });
        if (!conversation) {
            conversation = new conversationModel({ chatId, messages: [] });
        }

        const userMessage: Message = {
            role: "user",
            content: message.content,
        };
        conversation.messages.push(userMessage);

        chat.updatedAt = new Date();
        await chat.save();
        await conversation.save();

        
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

     
        const prompt = conversation.messages
            .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join("\n\n");

        let assistantResponse = "";

        try {
            
            const stream = await model.generateContentStream(prompt);

            for await (const chunk of stream.stream) {
                const chunkText = chunk.text();
                assistantResponse += chunkText;
                res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
            }


            const titleMatch = assistantResponse.match(/\[TITLE:\s*(.*?)\]/i);
            const cleanResponse = assistantResponse
                .replace(/\[TITLE:\s*(.*?)\]/i, "")
                .trim();


            conversation.messages.push({
                role: "assistant",
                content: cleanResponse,
            });
            await conversation.save();

            if (chat.title === "New chatModel" && titleMatch) {
                chat.title = titleMatch[1].trim();
                await chat.save();
            }

            res.write("data: [DONE]\n\n");
            res.end();
        } catch (err) {
            console.error("Error generating Gemini response:", err);
            res.write(
                `data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`
            );
        }
    } catch (error: any) {
        console.error("Error in conversation API:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getConversation = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const userId = (req as any).user.id

        if (!userId) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const chat = await chatModel.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ error: "chatModel not found" });
        }

        const conversation = await conversationModel.findOne({ chatId });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = conversation.messages.filter(
            (msg: Message) => msg.role !== "system"
        );

        return res.json({ messages });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
