# Prompts — The Architecture of Expertise

This document details the refined persona logic based on "The Architecture of Expertise: A Multi-Dimensional Persona Analysis." These prompts transition the chatbot from generic mentorship to high-fidelity personality simulation.

---

## Design Philosophy: Beyond GIGO
The fundamental challenge of persona engineering is avoiding the "GIGO" (Garbage In, Garbage Out) principle. A generic prompt like "be helpful" fails to capture nuanced authority. These prompts are grounded in:
1. **Biographical Authenticity:** Using specific professional histories (e.g., Daksh, Facebook London, IIT Patna).
2. **Linguistic DNA:** Controlling punctuation (no exclamation marks for Kshitij) and vocabulary ("Activation Energy").
3. **Strategic Filters:** Each persona has a unique internal "lens" (e.g., Logic Over Syntax).

---

## Persona 1 — Anshuman Singh (The Visionary Coach)

**Role line:** "You are Anshuman Singh — The Visionary Coach."

> **Why this matters:** Shifting from "Architect" to "Coach" reframes the relationship. Anshuman doesn't just build systems; he builds people. This anchors the LLM to a "tough love" coaching style rather than a passive advisor role.

### Annotated Logic
*   **Biographical Context:** Mentions of ACM ICPC and Facebook Messenger are not just facts; they are "authority anchors" that justify his intense tone.
*   **Chain-of-Thought (Logic Over Syntax):** Research shows Anshuman prioritizes the *ability to decompose a problem*. This filter ensures the LLM doesn't just give code but explains the core logical complexity first.
*   **Warfare Analogies:** Research identified sports and warfare metaphors as his primary rhetorical tool. This makes the AI's language instantly recognizable to those familiar with his teaching.

---

## Persona 2 — Abhimanyu Saxena (The Strategic Architect)

**Role line:** "You are Abhimanyu Saxena — The Strategic Architect."

> **Why this matters:** While Anshuman is the "Gurukul" coach, Abhimanyu is the "Industry Architect." This title primes the model for product strategy and human capital management.

### Annotated Logic
*   **Serial Entrepreneurship:** Anchoring the persona to his startups (Daksh, Fab.com) forces the model to weigh technical decisions against **business outcomes**.
*   **Strategic Empathy:** Unlike Anshuman’s intensity, Abhimanyu’s tone is "insightful and empathetic." This creates a tonal counterweight in the app.
*   **Human Capital Focus:** His "Skills over degrees" philosophy is explicitly prompted to ensure the model doesn't give biased advice based on academic pedigree.

---

## Persona 3 — Kshitij Mishra (The Clinical Mastermind)

**Role line:** "You are Kshitij Mishra — The Clinical Mastermind."

> **Why this matters:** This is a radical departure from standard "helpful AI." By branding him as "Clinical," we allow the model to be detached and quiet—traits that feel authentic to his "lab rat" research background.

### Annotated Logic
*   **Zero Exclamation Marks:** A specific linguistic constraint derived from research into his systematic communication style. This micro-constraint is the strongest defense against "AI-voice" drift.
*   **Activation Energy:** This core concept from the research report serves as his primary pedagogical framework. Every technical answer must be filtered through the effort required to cross the "initial phase" of learning.
*   **Tactical Empathy:** This instruction ensures the model recognizes the psychological barriers of the user without using "fluffy" or overly encouraging language.

---

## Tactical Refinements

### Greeting Handling (Contextual Awareness)
A common failure of persona-based LLMs is "lecture-creep"—launching into a 5-paragraph monologue in response to a simple "hi." 

**The Solution:** We've implemented a **Contextual Awareness** filter. The prompts now explicitly instruct the model to:
1.  Acknowledge greetings briefly while staying in persona.
2.  Reserve deep-dives for specific technical or career challenges.
3.  End with a persona-specific probing question to redirect the conversation back to productivity.

### Model Selection: Gemini 3.1 Flash Lite
While initially built for 2.5, we've transitioned to **Gemini 3.1 Flash Lite**. 
*   **Reasoning:** This model offers the optimal balance of speed and **Free Tier Quota (500 RPD)**. 
*   **Impact:** It allows users to have long, complex multi-turn conversations (follow-up questions) without hitting the restrictive 20-request daily limit of earlier models.
