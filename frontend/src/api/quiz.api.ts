import { QuizData } from "@/components/QuizRendere";
import { apiFetch } from "@/lib/api";
import { QueryFunctionContext, useMutation, useQuery } from "@tanstack/react-query";

const generateQuiz = async ({ file }: { file: File }) => {
    const formData = new FormData();
    if (file) formData.append("file", file);

    const response = await apiFetch("/quiz/generate", {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to send message");

    return response.json();
};



export const useGenerateQuiz = () =>
    useMutation({
        mutationKey: ["generateQuiz"],
        mutationFn: generateQuiz,
    });

const generateNewQuiz = async ({ file, quiz }: { file: File, quiz: QuizData }) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("quiz", JSON.stringify(quiz));
    const response = await apiFetch("/quiz/new", {
        method: "POST",
        body: formData,
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();

};
export const useGenerateNewQuiz = () =>
    useMutation({
        mutationKey: ["generateNewQuiz"],
        mutationFn: generateNewQuiz,
    });

const submitQuiz = async (data: { userId: string; userAnswers: Record<string, string>, quiz: QuizData }) => {
    const response = await apiFetch("/quiz/submit", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to submit quiz");

    return response.json();
}

export const useSubmitQuiz = () =>
    useMutation({
        mutationKey: ["submitQuiz"],
        mutationFn: submitQuiz,
    });




const fetchQuizStats = async ({ queryKey }: QueryFunctionContext) => {
    // queryKey = ["quizStats", userId]
    const userId = queryKey[1]; // second element in the array
    const response = await apiFetch(`/quiz/stats/${userId}`, {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch quiz stats");
    return response.json();
};


export const useFetchQuizStats = (userId: string) => {
    return useQuery({
        queryKey: ["quizStats", userId],
        queryFn: fetchQuizStats,
    });
};

