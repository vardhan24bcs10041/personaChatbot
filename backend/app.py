"""
Persona Chatbot — Backend API Server

A Flask application that serves as the backend for the persona-based AI chatbot.
It exposes a single POST endpoint /api/chat that accepts a persona identifier
and conversation history, then returns a response from the Gemini LLM.
"""

import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from personas import PERSONAS

# Load environment variables from .env file (for local development)
load_dotenv()

app = Flask(__name__)

# Enable CORS for all origins (frontend can be on a different domain in production)
CORS(app)

# Configure the Gemini API client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is not set. "
        "Please set it in your .env file or in your deployment environment."
    )

client = genai.Client(api_key=api_key)


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    POST /api/chat
    
    Request Body (JSON):
    {
        "persona": "anshuman" | "abhimanyu" | "kshitij",
        "messages": [
            { "role": "user", "content": "Hello!" },
            { "role": "assistant", "content": "Hi there..." },
            ...
        ]
    }
    
    Response (JSON):
    {
        "reply": "The persona's response text..."
    }
    
    Error Response (JSON):
    {
        "error": "Description of what went wrong"
    }
    """
    try:
        data = request.get_json()

        # Validate request body
        if not data:
            return jsonify({"error": "Request body must be valid JSON."}), 400

        persona_key = data.get("persona", "").lower()
        messages = data.get("messages", [])

        # Validate persona
        if persona_key not in PERSONAS:
            return jsonify({
                "error": f"Unknown persona '{persona_key}'. "
                         f"Valid options: {', '.join(PERSONAS.keys())}"
            }), 400

        # Validate messages
        if not messages or not isinstance(messages, list):
            return jsonify({"error": "Messages must be a non-empty list."}), 400

        persona = PERSONAS[persona_key]
        system_prompt = persona["prompt"]

        # Build the conversation contents for Gemini
        # Map our message format to Gemini's expected format
        contents = []
        for msg in messages:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.get("content", ""))],
                )
            )

        # Call the Gemini API with retry for rate limits
        max_retries = 2
        last_error = None
        for attempt in range(max_retries + 1):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.8,
                        max_output_tokens=1024,
                    ),
                )
                return jsonify({"reply": response.text})
            except Exception as api_err:
                last_error = api_err
                err_str = str(api_err)
                # Retry on rate limit errors
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    if attempt < max_retries:
                        wait_time = (attempt + 1) * 5  # 5s, 10s
                        print(f"[WARN] Rate limited, retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")
                        time.sleep(wait_time)
                        continue
                    else:
                        return jsonify({
                            "error": "The API is rate-limited right now. Please wait a few seconds and try again."
                        }), 429
                # Non-retryable error
                raise

    except Exception as e:
        # Log the error for debugging (visible in Render logs)
        print(f"[ERROR] /api/chat failed: {type(e).__name__}: {e}")
        return jsonify({
            "error": "Something went wrong while generating a response. "
                     "Please try again in a moment."
        }), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint for Render."""
    return jsonify({"status": "ok", "personas": list(PERSONAS.keys())})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
