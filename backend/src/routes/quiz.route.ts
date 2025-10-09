import express, { Request, Response } from "express";
import multer from "multer";
import { generateQuizFromPDF, evaluateQuiz, newQuizgenerate, fetchQuizStats } from "../controllers/quizController";
import authMiddleware from "../middleware/auth";

const quiz = express.Router();
const upload = multer({ dest: "uploads/" });
quiz.use(authMiddleware);

quiz.post("/generate", upload.single("file"), async (req: Request, res: Response) => {
    await generateQuizFromPDF(req, res);
});

quiz.post("/new", upload.single("file"), async (req: Request, res: Response) => {
    await newQuizgenerate(req, res);
});

quiz.post("/submit", async (req: Request, res: Response) => {
    await evaluateQuiz(req, res);
});

quiz.get("/stats/:userId", async (req: Request, res: Response) => {
    await fetchQuizStats(req, res);
});

export default quiz;
