import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? "AIzaSyCM0RPEjoyDC0sywXVui0raklYle8p7uII";
console.log("Gemini API Key:", apiKey);
export const ai = new GoogleGenerativeAI(
    apiKey as string
);

export const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash", 
});
