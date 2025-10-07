import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { model } from "../utils/gemini";

export const handleSendMessage = async (req: Request, res: Response) => {
    try {
        const userMessage = req.body.message;
        const file = req.file;

        if (!userMessage && !file) {
            return res.status(400).json({
                success: false,
                message: "Please provide a message or file",
            });
        }

        const parts: any[] = [];

        if (userMessage) {
            parts.push({ text: userMessage });
        }

        if (file) {
            const filePath = path.resolve(file.path);
            const fileData = fs.readFileSync(filePath);

            parts.push({
                inlineData: {
                    mimeType: file.mimetype,
                    data: fileData.toString("base64"),
                },
            });
        }
        const response = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts,
                },
            ],
        });
        if (file) fs.unlinkSync(file.path);

        const aiResponse = response.response?.text() ?? "No response from Gemini";

        res.status(200).json({
            success: true,
            message: aiResponse,
        });
    } catch (error: any) {
        console.error("Error in handleSendMessage:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
