// store/quizStore.ts
import { QuizData } from "@/components/QuizRendere";
import { create } from "zustand";

interface QuizState {
    quizData: QuizData | null;
    setQuizData: (data: QuizData) => void;
    clearQuizData: () => void;
    file: File | null;
    setquizFile: (file: File | null) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
    quizData: null,
    setQuizData: (data) => set({ quizData: data }),
    clearQuizData: () => set({ quizData: null }),
    file: null,
    setquizFile: (file) => set({ file }),
}));
