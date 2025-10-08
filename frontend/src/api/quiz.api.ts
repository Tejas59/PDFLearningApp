import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const generateQuiz = async ({ file }: { file: File }) => {
    const formData = new FormData();
    if (file) formData.append("file", file);

    const response = await apiFetch("/quiz/generate", {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to send message");

    console.log(response);

    return response.json();
};



export const useGenerateQuiz = () =>
    useMutation({
        mutationKey: ["generateQuiz"],
        mutationFn: generateQuiz,
    });

