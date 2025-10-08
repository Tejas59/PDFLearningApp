"use client";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Brain, Paperclip, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendMessage } from "@/api/message.api";
import { userAuthStore } from "@/store/userAuthStore";
import { useGenerateQuiz } from "@/api/quiz.api";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

interface ChatInputProps {
  setFileUrl: React.Dispatch<React.SetStateAction<string | null>>;
  sidebarOpen: boolean;
}

const ChatInput = ({ setFileUrl, sidebarOpen }: ChatInputProps) => {
  const router = useRouter();
  const { setQuizData } = useQuizStore();
  const { mutateAsync, isPending } = useSendMessage();
  const { mutateAsync: quizMuation } = useGenerateQuiz();
  const { isAuthenticated } = userAuthStore();
  const { setquizFile } = useQuizStore();

  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [quizMode, setQuizMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    if (!isPending) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        e.target.value = "";
        setFile(null);
        setFileUrl(null);
        setquizFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        setquizFile(selectedFile);
        const blobUrl = URL.createObjectURL(selectedFile);
        setFileUrl(blobUrl);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setFileUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quizMode && file) {
      const res = await quizMuation({
        file: file ?? undefined,
      });
      setQuizData(res.quiz);
      router.push("/quiz");
    } else {
      if (!input.trim() && !file) return;
      const res = await mutateAsync({
        message: input,
        file: file ?? undefined,
      });
      setData(res);
    }
    setInput("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div
      className={cn(
        "w-full max-w-4xl rounded-xl bg-[#f4f4f6] py-4 px-4 shadow-[0_-1px_6px_rgba(0,0,0,0.05)] transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "md:ml-0"
      )}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {file && (
          <div className="flex items-center justify-between bg-white border rounded-md p-2 mb-2 text-sm text-gray-700 max-w-60">
            <span className="truncate ">{file.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Textarea
          ref={textareaRef}
          placeholder={
            file
              ? "Write your question about the uploaded PDF..."
              : "Ask anything about your PDF document"
          }
          className="w-full resize-none overflow-hidden text-sm bg-transparent border-none outline-none right-0 focus:outline-none focus:border-none focus:ring-0 shadow-none px-2 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending || quizMode}
          rows={1}
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending || !!file}
              onClick={handleFileClick}
              className="h-9 w-9 rounded-md border border-gray-300"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending || !file || !isAuthenticated}
              className={`h-9 w-9 rounded-md border border-gray-3001 ${
                quizMode && "bg-black text-white hover:!bg-black cursor-default"
              }`}
              onClick={() => setQuizMode(!quizMode)}
            >
              <Brain className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isPending || (!input.trim() && !file)}
            className={cn(
              "bg-blue-600 text-white h-9 w-9 p-2 rounded-md ",
              !input.trim() && !file && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
