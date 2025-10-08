import express, { Request, Response } from "express";
import multer from "multer";
import { generateQuizFromPDF, evaluateQuiz } from "../controllers/quizController";
import authMiddleware from "@/middleware/auth";

const quiz = express.Router();
const upload = multer({ dest: "uploads/" });
quiz.use(authMiddleware);

quiz.post("/generate", upload.single("file"), async (req: Request, res: Response) => {
    await generateQuizFromPDF(req, res);
});

quiz.post("/submit", async (req: Request, res: Response) => {
    try {
        const { answers, quizId } = req.body;
        const result = await evaluateQuiz(quizId, answers);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to score quiz" });
    }
});

export default quiz;
