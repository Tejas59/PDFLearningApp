// import { GoogleGenAI } from "@google/genai";
// import * as fs from 'fs';
// import * as path from 'path';
import dotenv from "dotenv";
// import { File } from '@google/genai/server'; // Import the File type for stronger typing

import { GoogleGenAI } from "@google/genai";

// // Load environment variables from .env file
dotenv.config();

// // Initialize the Gemini AI client
// // NOTE: API key is automatically picked up from GEMINI_API_KEY environment variable if not passed here.
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// /**
//  * Uploads a PDF, generates quiz questions, and cleans up the file.
//  * @param filePath The local path to the PDF file.
//  */
// async function generateQuizFromPdf(filePath: string) {
//     // We use the imported File type for better type safety
//     let uploadedFile: File | undefined;
//     const modelName = 'gemini-2.5-flash';

//     try {
//         console.log(`1. Uploading file: ${path.basename(filePath)}...`);

//         // 1. UPLOAD THE FILE using the File API
//         // FIX 1: 'mimeType' property is not part of the upload object.
//         // The file path and file name are sufficient for the SDK to determine the type.
//         uploadedFile = await ai.files.upload({
//             file: filePath,
//             // You may keep this if your file extension isn't clear, but typically not needed:
//             // mimeType: 'application/pdf', 
//             displayName: path.basename(filePath)
//         });

//         // Ensure the uploadedFile is correctly typed to use its properties later
//         if (!uploadedFile) {
//             throw new Error("File upload failed.");
//         }

//         console.log(`✅ File uploaded successfully. URI: ${uploadedFile.uri}`);

//         // 2. DEFINE THE PROMPT and CONTENTS
//         const prompt = `Based on the uploaded PDF document, create 5 challenging multiple-choice quiz questions. 
//                         For each question, provide:
//                         1. The question text.
//                         2. The four possible answers (A, B, C, D).
//                         3. The correct answer key (e.g., "Answer: C").
//                         Format the output using Markdown.`;

//         const contents = [
//             // The uploaded file object is passed directly as a part
//             uploadedFile,
//             // The text prompt part
//             { text: prompt },
//         ];

//         console.log(`2. Generating 5 quiz questions using model ${modelName}...`);

//         // 3. GENERATE THE CONTENT
//         // FIX 2: 'getGenerativeModel' is not a method on 'GoogleGenAI'.
//         // The correct method is 'ai.models.generateContent' or 'ai.generateContent' directly.
//         // We will use 'ai.models.generateContent' for clarity and to pass the model name.
//         const response = await ai.models.generateContent({
//             model: modelName,
//             contents: contents,
//             config: { // Changed 'generationConfig' to 'config'
//                 temperature: 0.1
//             }
//         });

//         console.log('✅ Quiz Generation Complete. \n');
//         console.log('--- Generated Quiz Questions ---\n');
//         // The 'response.response.text()' structure is correct for the standard response object.
//         console.log(response.text);
//         console.log('\n--------------------------------');

//     } catch (error) {
//         console.error('An error occurred during quiz generation:', error);
//     } finally {
//         // 4. CLEANUP: Delete the file from the Gemini service storage
//         // FIX 3: Add a null check. 'uploadedFile.name' is implicitly a string, 
//         // but TypeScript can't be sure it's set if an error occurred before the upload.
//         if (uploadedFile) {
//             console.log(`\n3. Deleting uploaded file: ${uploadedFile.name}...`);
//             // The delete method is correct, but the type is now guaranteed
//             await ai.files.delete({ name: uploadedFile.name });
//             console.log('✅ File deleted successfully. Process complete.');
//         }
//     }
// }



const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY ?? "AIzaSyCM0RPEjoyDC0sywXVui0raklYle8p7uII"
});

console.log("Gemini API Key:", process.env.GEMINI_API_KEY );

const modelName = 'gemini-2.5-flash';

async function testFunction() {

    const response = await ai.models.generateContent({
        model: modelName,
        contents: "Write a short poem about the sea."
    });
    console.log(response.text);
}

(async () => {
    await testFunction();
})();