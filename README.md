# PDF Learning App

A full-stack web application for learning and practicing concepts from PDFs, including quizzes and AI-powered tools.

Live demo https://pdf-learning-app.vercel.app

---

## 🛠 Setup

### 1. Clone the repo in your Device

### Backend (Node.js + Express + TypeScript)

1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file with the following variables
```bash
APP_PORT=8080
APP_PREFIX_PATH=/api
DB_URI=<Your MongoDB connection string>
DB_NAME=pdf-learning-app
JWT_SECRET=<Your JWT secret>
GEMINI_API_KEY=<Your Google Gemini/AI key>
```
4. start the backend:
```bash
npm run dev
```

### Frontend (Next.js + Tailwind CSS)
1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file with the following variables
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080  
```
4. start the backend:
```bash
npm run dev
```

### How It’s Built
Backend:

* Node.js + Express + TypeScript

* MongoDB for storing users, quizzes, and PDF data

* JWT authentication

* Middleware for auth and CORS

* AI integration via Google Generative AI (@google/genai) for quiz generation or content suggestions

Frontend:

* Next.js + Tailwind CSS

* shadcnUI

* zustand

* Tanstack query 


### What’s Done
* User registration & authentication

* Upload and view PDFs

* Generate quizzes from PDFs

* AI-assisted content / quiz generation

* Left drawer: list of chats, main chat window, input box at bottom.

* Chat UI (ChatGPT-inspired) Chatbot Agent using gemini 

* Tiny dashboard to manage and track user’s learning journey

### What's Missing 
* Full error handling & validation on frontend

* RAG answers with citations

* YouTube Videos Recommendor

### Use of any LLM tools? For what purposes?.
I have used the LLM tools like chatGpt, gemini to understand the concepts of different library like zustand, Tanstack query, and different component and for the code generation I have also used the Copilot for code generation. 

