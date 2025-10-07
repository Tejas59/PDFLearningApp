import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface SendMessageOptions {
    message: string;
    file?: File;
}

interface SendMessageResponse {
    success: boolean;
    message: string;
}

const sendMessage = async ({ message, file }: SendMessageOptions) => {
    const formData = new FormData();
    formData.append("message", message);
    if (file) formData.append("file", file);

    const response = await apiFetch("/message", {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to send message");

    console.log(response);

    return response.json();
};

export const useSendMessage = () =>
    useMutation<SendMessageResponse, Error, SendMessageOptions>({
        mutationFn: sendMessage,
    });
