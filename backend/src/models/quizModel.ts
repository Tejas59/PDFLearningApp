import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    mcq: {
        total: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
    },
    saq: {
        total: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
    },
    laq: {
        total: { type: Number, default: 0 },
        correct: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

export const quizModel = mongoose.model("QuizModel", quizSchema);
