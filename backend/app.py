import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from personas import PERSONAS

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY environment variable is not set. "
        "Please set it in your .env file or in your deployment environment."
    )

client = genai.Client(api_key=api_key)


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body must be valid JSON."}), 400

        persona_key = data.get("persona", "").lower()
        messages = data.get("messages", [])

        if persona_key not in PERSONAS:
            return jsonify({
                "error": f"Unknown persona '{persona_key}'. "
                         f"Valid options: {', '.join(PERSONAS.keys())}"
            }), 400

        persona = PERSONAS[persona_key]
        system_prompt = persona["prompt"]

        cleaned_messages = []
        for msg in messages:
            content = msg.get("content", "").strip()
            role = msg.get("role")
            if content and role in ["user", "assistant", "model"]:
                cleaned_messages.append({
                    "role": "user" if role == "user" else "model",
                    "content": content
                })

        if not cleaned_messages:
            return jsonify({"error": "No valid messages found in history."}), 400

        contents = []
        for msg in cleaned_messages:
            contents.append(
                types.Content(
                    role=msg["role"],
                    parts=[types.Part.from_text(text=msg["content"])],
                )
            )

        fallback_models = [
            "gemini-3.1-flash-lite-preview",
            "gemini-2.5-flash",
            "gemini-2.0-flash"
        ]
        
        last_error = None
        for model_name in fallback_models:
            try:
                response = client.models.generate_content(
                    model=model_name,
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
                if any(x in err_str for x in ["429", "RESOURCE_EXHAUSTED", "503", "UNAVAILABLE"]):
                    print(f"[WARN] Model {model_name} rate limited or unavailable. Trying next model...")
                    continue
                raise

        return jsonify({
            "error": "All AI models are currently busy or rate-limited. Please wait a few seconds and try again."
        }), 429

    except Exception as e:
        import traceback
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"[ERROR] /api/chat failed: {error_msg}")
        print(traceback.format_exc())
        return jsonify({
            "error": f"Something went wrong: {error_msg}. Please try again."
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "personas": list(PERSONAS.keys())})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
