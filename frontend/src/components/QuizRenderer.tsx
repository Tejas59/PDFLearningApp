"use client";
import { useGenerateNewQuiz, useSubmitQuiz } from "@/api/quiz.api";
import { useQuizStore } from "@/store/quizStore";
import { userAuthStore } from "@/store/userAuthStore";
import React, { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface SAQ {
  question: string;
  answer: string;
  explanation: string;
}

interface LAQ {
  question: string;
  answer: string;
  explanation: string;
}

export interface QuizData {
  mcqs: MCQ[];
  saqs: SAQ[];
  laqs: LAQ[];
}

export default function QuizRenderer() {
  const quiz = useQuizStore((state) => state.quizData);
  const file = useQuizStore((state) => state.file);
  const setQuizData = useQuizStore((state) => state.setQuizData);
  const { mutateAsync: quizMuation } = useGenerateNewQuiz();
  const { mutateAsync: submitQuizMutation } = useSubmitQuiz();
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const { user } = userAuthStore();

  const [submitted, setSubmitted] = useState(false);


  const handleChange = (key: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [key]: value }));
  };

 
  const allAnswered =
    quiz &&
    [
      ...quiz.mcqs.map((_, i) => `mcq-${i}`),
      ...quiz.saqs.map((_, i) => `saq-${i}`),
      ...quiz.laqs.map((_, i) => `laq-${i}`),
    ].every((key) => userAnswers[key] && userAnswers[key].trim() !== "");

  const handleSubmit = async () => {
    await submitQuizMutation({
      userId: user?.id as string,
      quiz: quiz as QuizData,
      userAnswers,
    });
    setSubmitted(true);
  };

  const handleRegenerateClick = async () => {
    const res = await quizMuation({
      file: file as File,
      quiz: quiz as QuizData,
    });
    setQuizData({ ...res.quiz });
    setUserAnswers({});
  };

  useEffect(() => {
    setUserAnswers({});
    setSubmitted(false);
  }, [quiz]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Generated Quiz</h2>
      <section>
        <h3 className="text-xl font-semibold mb-2">
          Multiple Choice Questions
        </h3>
        {quiz?.mcqs.map((q, i) => (
          <div key={i} className="p-4 mb-3 border rounded-2xl">
            <p className="font-medium">
              {i + 1}. {q.question}
            </p>
            <div className="mt-2 space-y-1">
              {q.options.map((opt, j) => (
                <label key={j} className="block">
                  <input
                    type="radio"
                    name={`mcq-${i}`}
                    value={opt}
                    disabled={submitted}
                    checked={userAnswers[`mcq-${i}`] === opt}
                    onChange={(e) => handleChange(`mcq-${i}`, e.target.value)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {submitted && (
              <div className="mt-2 text-sm">
                <p>
                  <strong>Correct:</strong> {q.answer}
                </p>
                <p className="text-gray-600">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">Short Answer Questions</h3>
        {quiz?.saqs.map((q, i) => (
          <div key={i} className="p-4 mb-3 border rounded-2xl">
            <p className="font-medium">
              {i + 1}. {q.question}
            </p>
            <Textarea
              className="w-full p-2 mt-2 border rounded-md"
              rows={2}
              disabled={submitted}
              value={userAnswers[`saq-${i}`] || ""}
              onChange={(e) => handleChange(`saq-${i}`, e.target.value)}
            />
            {submitted && (
              <p className="text-gray-600 mt-1">
                <strong>Expected:</strong> {q.answer}
                <br />
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">Long Answer Questions</h3>
        {quiz?.laqs.map((q, i) => (
          <div key={i} className="p-4 mb-3 border rounded-2xl">
            <p className="font-medium">
              {i + 1}. {q.question}
            </p>
            <Textarea
              className="w-full p-2 mt-2 border rounded-md"
              rows={4}
              disabled={submitted}
              value={userAnswers[`laq-${i}`] || ""}
              onChange={(e) => handleChange(`laq-${i}`, e.target.value)}
            />
            {submitted && (
              <p className="text-gray-600 mt-1">
                <strong>Expected:</strong> {q.answer}
                <br />
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </section>

      <div className="flex items-center gap-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
              allAnswered ? "bg-blue-600" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Submit Answers
          </button>
        )}

        {submitted && (
          <button
            onClick={handleRegenerateClick}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Generate New Quiz
          </button>
        )}
      </div>
    </div>
  );
}
