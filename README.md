# Persona Chatbot — Scaler Academy

A persona-based AI chatbot that lets you have real conversations with three Scaler/InterviewBit personalities: **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona has a meticulously crafted system prompt with distinct personality, vocabulary, and mentorship style.

> **Live Demo:** [https://persona-chatbot-mewq.onrender.com](https://persona-chatbot-mewq.onrender.com)

---

## Features

- **Three distinct AI personas** — each with unique tone, vocabulary, and teaching philosophy
- **Persona switcher** — switch between personalities with a single click; conversation resets automatically
- **Suggestion chips** — quick-start questions tailored to each persona
- **Typing indicator** — animated dots while the AI is thinking
- **Responsive design** — works beautifully on both desktop and mobile
- **Error handling** — graceful error messages if the API fails
- **Dark theme** — premium glassmorphism UI with persona-specific accent colors

---

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend  | Python, Flask, Flask-CORS |
| LLM API  | Google Gemini 2.0 Flash |
| Deployment | Render (Backend: Web Service, Frontend: Static Site) |

---

## Project Structure

```
personaChatbot/
├── backend/
│   ├── app.py              # Flask API server
│   ├── personas.py         # System prompts for all 3 personas
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variable template
│   └── .env                # (gitignored) your actual API key
├── frontend/
│   ├── index.html          # Chat UI
│   ├── style.css           # Styling (dark theme, glassmorphism)
│   ├── script.js           # Chat logic & persona switching
│   └── assets/             # Persona avatar images
├── prompts.md              # All 3 prompts with design annotations
├── reflection.md           # 300–500 word reflection
├── README.md               # This file
└── .gitignore
```

---

## Local Setup

### Prerequisites

- Python 3.9+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/personaChatbot.git
cd personaChatbot
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Add your API key

```bash
cp .env.example .env
# Edit .env and replace 'your_gemini_api_key_here' with your actual key
```

### 4. Start the backend

```bash
python app.py
```

The backend will start at `http://localhost:5000`.

### 5. Start the frontend

Open `frontend/index.html` in your browser, or use a local server:

```bash
cd ../frontend
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> **Note:** For local development, `script.js` uses `http://localhost:5000` as the API URL. Update the `API_BASE_URL` constant in `script.js` to your Render backend URL before deploying the frontend.

---

## Deployment on Render

### Backend (Web Service)

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `pip install -r requirements.txt`
5. Set **Start Command** to `gunicorn app:app`
6. Add environment variable: `GEMINI_API_KEY` = your API key

### Frontend (Static Site)

1. Create a new **Static Site** on Render
2. Connect the same GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Publish Directory** to `./`
5. **Before deploying:** Update `API_BASE_URL` in `script.js` to your backend's Render URL

---

## Environment Variables

| Variable         | Description                | Required |
|------------------|----------------------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key      | Yes      |

> ⚠️ Never commit your `.env` file. Use `.env.example` as a template.

---

## Documentation

- **[prompts.md](./prompts.md)** — All three system prompts with annotated design decisions
- **[reflection.md](./reflection.md)** — 300–500 word reflection on GIGO, learnings, and improvements
