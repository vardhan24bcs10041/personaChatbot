# Persona Chatbot — GenAI Assignment

A persona-based AI chatbot that lets you have real conversations with three Scaler/InterviewBit personalities: **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona has a meticulously crafted system prompt with distinct personality, vocabulary, and mentorship style — powered by Google Gemini 3.1 Flash Lite.

> **Live Demo:** [https://persona-chatbot-mewq.onrender.com](https://persona-chatbot-mewq.onrender.com)

---

## Features

- **Three distinct AI personas** — each with unique tone, vocabulary, few-shot examples, hidden chain-of-thought reasoning, and teaching philosophy
- **Persona switcher** — switch between personalities with a single click; conversation resets automatically
- **Suggestion chips** — quick-start questions tailored to each persona's domain
- **Typing indicator** — animated dots while the AI generates a response
- **Responsive design** — fully optimized for desktop, tablet, and mobile (down to 320px)
- **Graceful error handling** — user-friendly toast notifications for API failures and rate limits
- **Premium dark theme** — glassmorphism UI with animated gradient mesh background, per-persona accent colors, and micro-animations
- **Retry logic** — automatic retry with backoff on rate-limited API requests

---

## Tech Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Frontend   | HTML, CSS, JavaScript (Vanilla)                      |
| Backend    | Python, Flask, Flask-CORS                            |
| LLM API    | Google Gemini 3.1 Flash Lite                              |
| Deployment | Render (Backend: Web Service, Frontend: Static Site) |

---

## Personas

| Persona              | Style                                | Accent Color |
| -------------------- | ------------------------------------ | ------------ |
| **Anshuman Singh**   | Intense, direct, performance-focused | Amber        |
| **Abhimanyu Saxena** | Calm, strategic, product-first       | Cyan         |
| **Kshitij Mishra**   | Systematic, disciplined, dry humor   | Purple       |

Each persona prompt includes:

- Detailed background and communication style
- Three few-shot example conversations
- Hidden chain-of-thought reasoning instructions
- Output format and length constraints
- Explicit behavioral boundaries

---

## Project Structure

```
personaChatbot/
├── backend/
│   ├── app.py              Flask API server (POST /api/chat, GET /health)
│   ├── personas.py         System prompts for all 3 personas
│   ├── requirements.txt    Python dependencies
│   ├── .env.example        Environment variable template
│   └── .env                (gitignored) your actual API key
├── frontend/
│   ├── index.html          Chat interface
│   ├── style.css           Dark theme with glassmorphism and animations
│   ├── script.js           Chat logic, persona switching, API calls
│   └── assets/             Persona avatar images (PNG)
├── prompts.md              All 3 prompts with annotated design decisions
├── reflection.md           300–500 word reflection on GIGO and learnings
├── README.md               This file
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint    | Description                               |
| ------ | ----------- | ----------------------------------------- |
| POST   | `/api/chat` | Send a message and get a persona response |
| GET    | `/health`   | Health check, returns available personas  |

### POST `/api/chat` — Request Body

```json
{
  "persona": "anshuman",
  "messages": [
    { "role": "user", "content": "Which framework should I learn?" },
    { "role": "assistant", "content": "Stop chasing frameworks..." },
    { "role": "user", "content": "What about React?" }
  ]
}
```

### Response

```json
{
  "reply": "The persona's response text..."
}
```

---

## Local Setup

### Prerequisites

- Python 3.9+
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/vardhan24bcs10041/personaChatbot.git
cd personaChatbot
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate


pip install -r requirements.txt
```

### 3. Add your API key

```bash
cp .env.example .env
```

Edit `.env` and add your actual key.

### 4. Start the backend

```bash
python app.py
```

The backend will start at `http://localhost:5000`.

### 5. Start the frontend

Open `frontend/index.html` directly in your browser, or serve it locally:

```bash
cd ../frontend
python -m http.server 8080
```

Then open `http://localhost:8080`.

> **Note:** For local development, update the `API_BASE_URL` constant at the top of `script.js` to `http://localhost:5000`. Change it back to your Render backend URL before deploying.

---

## Deployment on Render

### Backend (Web Service)

1. Create a new **Web Service** on Render
2. Connect the GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `pip install -r requirements.txt`
5. Set **Start Command** to `gunicorn app:app`
6. Add environment variable: `GEMINI_API_KEY` = the API key

### Frontend (Static Site)

1. Create a new **Static Site** on Render
2. Connect the same GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Publish Directory** to `./`
5. Ensure `API_BASE_URL` in `script.js` points to the backend's Render URL

---

## Environment Variables

| Variable         | Description           | Required |
| ---------------- | --------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key | Yes      |

---

## Documentation

- **[prompts.md](./prompts.md)** — All three system prompts with annotated design decisions
- **[reflection.md](./reflection.md)** — Reflection on GIGO, prompt engineering learnings, and future improvements
