import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { model } from "../utils/gemini";
import { quizModel } from "../models/quizModel";


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



export const newQuizgenerate = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const previousQuiz = req.body.quiz ? JSON.parse(req.body.quiz) : null;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please provide a file",
            });
        }

        const parts: any[] = [];


        const prompt = `
You are a quiz generator. Analyze the following course material (attached PDF) and generate a NEW quiz that does NOT repeat or closely resemble these previous questions:

${previousQuiz ? JSON.stringify(previousQuiz, null, 2) : "[]"}

Return ONLY pure JSON — no markdown, no explanations.

JSON structure:
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
- 3 NEW Multiple Choice Questions (MCQs)
- 1 NEW Short Answer Question (SAQ)
- 1 NEW Long Answer Question (LAQ)
`;

        parts.push({ text: prompt });

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
            contents: [{ role: "user", parts }],
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


export const evaluateQuiz = async (req: Request, res: Response) => {
    try {
        const { userId, quiz, userAnswers } = req.body;

        if (!userId || !quiz || !userAnswers) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (userId, quiz, userAnswers)",
            });
        }

        let mcqCorrect = 0;
        quiz.mcqs.forEach((q: any, i: number) => {
            const userAns = userAnswers[`mcq-${i}`];
            const userOption = userAns ? userAns[0] : "";
            if (userOption === q.answer) mcqCorrect++;
        });

        const evaluationPrompt = `
You are an evaluator. Compare the following user answers with the correct answers.
Return JSON only in this structure:
{
  "saqs": [{ "isCorrect": true/false }],
  "laqs": [{ "isCorrect": true/false }]
}

Questions and answers:
${JSON.stringify({ saqs: quiz.saqs, laqs: quiz.laqs, userAnswers }, null, 2)}
`;

        const evalResponse = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: evaluationPrompt }] }],
        });

        const rawEval = evalResponse.response?.text() ?? "{}";
        let evaluatedData;
        try {
            evaluatedData = JSON.parse(rawEval);
        } catch {
            const cleaned = rawEval.replace(/```json|```/g, "").trim();
            evaluatedData = JSON.parse(cleaned);
        }

        const saqResults = evaluatedData.saqs ?? [];
        const laqResults = evaluatedData.laqs ?? [];

        const saqCorrect = saqResults.filter((q: any) => q.isCorrect).length;
        const laqCorrect = laqResults.filter((q: any) => q.isCorrect).length;

        const existing = await quizModel.findOne({ userId });

        if (existing) {
            existing.mcq = existing.mcq || { total: 0, correct: 0 };
            existing.saq = existing.saq || { total: 0, correct: 0 };
            existing.laq = existing.laq || { total: 0, correct: 0 };
            existing.mcq.total += quiz.mcqs.length;
            existing.mcq.correct += mcqCorrect;
            existing.saq.total += quiz.saqs.length;
            existing.saq.correct += saqCorrect;
            existing.laq.total += quiz.laqs.length;
            existing.laq.correct += laqCorrect;

            await existing.save();
            return res.status(200).json({ success: true, attempt: existing });
        } else {
            const newAttempt = await quizModel.create({
                userId,
                mcq: { total: quiz.mcqs.length, correct: mcqCorrect },
                saq: { total: quiz.saqs.length, correct: saqCorrect },
                laq: { total: quiz.laqs.length, correct: laqCorrect },
            });
            return res.status(200).json({ success: true, attempt: newAttempt });
        }


    } catch (error: any) {
        console.error("Error in evaluateQuiz:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


export const fetchQuizStats = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const stats = await quizModel.findOne({ userId });
        if (!stats) {
            return res.status(404).json("No Data Found");
        }
        return res.status(200).json(stats);
    } catch (error: any) {
        console.error("Error in fetchQuizStats:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

