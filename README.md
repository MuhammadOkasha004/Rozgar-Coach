# Rozgar Coach — AI Interview Coach for Pakistan

> Pakistan Ka Pehla AI Interview Coach — bilingual (Urdu/English) mock interview platform powered by Claude AI.

A full-stack web application that helps Pakistani job seekers practice mock interviews, get real-time AI feedback, and improve their performance. Built specifically for **fresh graduates, government job aspirants (BPS), banking, IT, teaching, sales, and healthcare candidates**.

---

## Tech Stack

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Backend  | ASP.NET Core 8 Web API (C#)                           |
| Frontend | React 18 + TypeScript + Vite                          |
| Styling  | Tailwind CSS                                          |
| AI       | OpenRouter API (any model, default `anthropic/claude-3.5-sonnet`) |
| HTTP     | Axios                                                 |
| State    | Zustand                                               |
| Icons    | Lucide React                                          |
| Routing  | React Router v6                                       |

---

## Features

- Bilingual support (Urdu / English / Mixed Roman Urdu)
- 6 job categories: Government, Banking, IT, Teaching, Sales, Healthcare
- 3 difficulty levels: Beginner, Intermediate, Expert
- 10-question dynamic AI mock interview
- Real-time AI feedback per answer (4 scoring dimensions)
- Performance report with overall + breakdown scores
- Q&A review with ideal answers (expandable)
- Beautiful lime-green + white theme, mobile responsive
- Live timer, progress bar, context-aware tips sidebar

---

## Project Structure

```
rozgar-coach/
├── backend/
│   └── RozgarCoach.API/
│       ├── Controllers/        # InterviewController, FeedbackController
│       ├── Services/           # OpenRouterService (OpenAI-compatible API)
│       ├── Models/             # Request/Response DTOs
│       ├── Program.cs
│       ├── appsettings.json
│       └── RozgarCoach.API.csproj
└── frontend/
    ├── src/
    │   ├── pages/              # HomePage, SelectJobPage, InterviewPage, FeedbackPage
    │   ├── components/         # Navbar, JobCard, ChatBubble, ProgressBar, etc.
    │   ├── services/           # api.ts (axios), jobData.ts, types.ts
    │   ├── store/              # Zustand store
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Setup Instructions

### 1. Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [OpenRouter API Key](https://openrouter.ai/keys) — get one from the OpenRouter dashboard

### 2. Backend Setup

```bash
cd backend/RozgarCoach.API

# Add your OpenRouter API key in appsettings.Development.json
# Replace "sk-or-v1-YOUR-KEY-HERE" with your real key
# You can also change the Model field (any OpenRouter model id)

# Restore packages & run
dotnet restore
dotnet run
```

The API will start at **http://localhost:5000**
Swagger UI: **http://localhost:5000/swagger**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will start at **http://localhost:5173**

---

## Configuration

### Backend — `appsettings.Development.json`

```json
{
  "OpenRouter": {
    "ApiKey": "sk-or-v1-YOUR-REAL-KEY-HERE",
    "BaseUrl": "https://openrouter.ai/api/v1",
    "Model": "anthropic/claude-3.5-sonnet",
    "SiteUrl": "http://localhost:5173",
    "AppName": "Rozgar Coach"
  }
}
```

The `Model` field accepts any [OpenRouter model id](https://openrouter.ai/models) (e.g. `openai/gpt-4o-mini`, `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.3-70b-instruct:free`).

### Frontend — `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The Vite dev server is configured to proxy `localhost:5173`, and the backend CORS policy allows this origin.

---

## API Endpoints

| Method | Endpoint                       | Description                                |
| ------ | ------------------------------ | ------------------------------------------ |
| GET    | `/api/interview/health`        | Health check                               |
| POST   | `/api/interview/question`      | Generate next interview question           |
| POST   | `/api/interview/evaluate`      | Evaluate candidate's answer, return JSON   |
| POST   | `/api/feedback/summary`        | Aggregate feedback across all questions    |

---

## Pages Overview

| Route          | Page                  | Purpose                                             |
| -------------- | --------------------- | --------------------------------------------------- |
| `/`            | HomePage              | Landing, hero, features, testimonials               |
| `/select-job`  | SelectJobPage         | Choose job category, language, difficulty           |
| `/interview`   | InterviewPage         | Live AI chat-style mock interview (10 questions)    |
| `/feedback`    | FeedbackPage          | Full performance report + Q&A review                |

---

## Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend
cd backend/RozgarCoach.API
dotnet publish -c Release -o ./publish
```

---

## Roadmap / Future Enhancements

- User accounts (Supabase / Firebase Auth)
- Save interview history
- Voice-based interviews (Whisper + TTS)
- PDF report generation (server-side)
- More job categories (FPSC-specific, NTS, PPSC)
- Mobile app (React Native)

---

## Credits

- **AI**: OpenRouter (default `anthropic/claude-3.5-sonnet`, swappable to any model)
- **Fonts**: Plus Jakarta Sans, Noto Nastaliq Urdu (Google Fonts)
- **Icons**: Lucide React

---

