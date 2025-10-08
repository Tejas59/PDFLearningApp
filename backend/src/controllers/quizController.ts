import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { model } from "../utils/gemini";


export const generateQuizFromPDF = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please provide a file",
            });
        }

        const parts: any[] = [];

        const prompt = `
You are a quiz generator. Analyze the following course material and return the output in **pure JSON** (no markdown, no explanations).

JSON structure example:
{
  "mcqs": [
    {
      "question": "What is ...?",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "explanation": "Reasoning behind the correct answer."
    }
  ],
  "saqs": [
    {
      "question": "Explain ...",
      "answer": "Short descriptive answer",
      "explanation": "Why this is correct."
    }
  ],
  "laqs": [
    {
      "question": "Describe ...",
      "answer": "Detailed answer text",
      "explanation": "Elaboration or key points expected in answer."
    }
  ]
}

Generate:
- 3 Multiple Choice Questions (MCQs)
- 1 Short Answer Questions (SAQs)
- 1 Long Answer Questions (LAQs)
`;


        if (prompt) {
            parts.push({ text: prompt });
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
        fs.unlinkSync(file.path);

        const rawText = response.response?.text() ?? "{}";

        let quizData;
        try {
            quizData = JSON.parse(rawText);
        } catch {
            const cleaned = rawText.replace(/```json|```/g, "").trim();
            quizData = JSON.parse(cleaned);
        }

        res.status(200).json({
            success: true,
            quiz: quizData,
        });
    } catch (error: any) {
        console.error("Error in generateQuizFromPDF:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


export const evaluateQuiz = async (req: Request, res: Response) => { }            