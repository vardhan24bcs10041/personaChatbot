/* ============================================
   PERSONA CHATBOT — APPLICATION LOGIC
   State management, persona switching, API calls,
   message rendering, and error handling.
   ============================================ */

// ---- Configuration ----
// Change this to your deployed backend URL on Render before deploying the frontend
const API_BASE_URL = "http://localhost:5000";

// ---- Persona Data ----
const PERSONA_DATA = {
    anshuman: {
        name: "Anshuman Singh",
        title: "The High-Performance Architect",
        avatar: "assets/anshuman.png",
        suggestions: [
            "Which framework should I learn in 2026?",
            "How do I crack FAANG interviews?",
            "Is it okay to skip Math for coding?",
        ],
    },
    abhimanyu: {
        name: "Abhimanyu Saxena",
        title: "The Strategic Builder",
        avatar: "assets/abhimanyu.png",
        suggestions: [
            "How do I build a startup as a developer?",
            "Should I use Microservices for my new idea?",
            "Is it better to be a specialist or generalist?",
        ],
    },
    kshitij: {
        name: "Kshitij Mishra",
        title: "The Pragmatic Architect & Disciplinarian",
        avatar: "assets/kshitij.png",
        suggestions: [
            "Can you explain the Flyweight pattern simply?",
            "How do I prepare for an LLD viva?",
            "What are the most common code smells?",
        ],
    },
};

// ---- State ----
let currentPersona = "anshuman";
let conversationHistory = []; // { role: "user"|"assistant", content: "..." }
let isLoading = false;

// ---- DOM References ----
const messagesContainer = document.getElementById("messages-container");
const welcomeScreen = document.getElementById("welcome-screen");
const welcomeAvatar = document.getElementById("welcome-avatar");
const welcomeAvatarRing = document.getElementById("welcome-avatar-ring");
const welcomeName = document.getElementById("welcome-name");
const welcomeTitle = document.getElementById("welcome-title");
const typingIndicator = document.getElementById("typing-indicator");
const typingAvatar = document.getElementById("typing-avatar");
const suggestionChips = document.getElementById("suggestion-chips");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const badgeAvatar = document.getElementById("badge-avatar");
const badgeName = document.getElementById("badge-name");
const errorToast = document.getElementById("error-toast");
const errorToastMessage = document.getElementById("error-toast-message");

// ---- Initialization ----
document.addEventListener("DOMContentLoaded", () => {
    switchPersona("anshuman");
    messageInput.addEventListener("input", updateSendButton);
});

// ---- Persona Switching ----
function switchPersona(persona) {
    if (isLoading) return; // Don't switch while a response is loading

    currentPersona = persona;
    conversationHistory = [];
    const data = PERSONA_DATA[persona];

    // Update body class for CSS accent colors
    document.body.className = `persona-${persona}`;

    // Update persona cards active state
    document.querySelectorAll(".persona-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.persona === persona);
    });

    // Update header badge
    badgeAvatar.src = data.avatar;
    badgeName.textContent = data.name;

    // Update welcome screen
    welcomeAvatar.src = data.avatar;
    welcomeName.textContent = data.name;
    welcomeTitle.textContent = data.title;

    // Update typing indicator avatar
    typingAvatar.src = data.avatar;

    // Clear messages and show welcome
    messagesContainer.innerHTML = "";
    welcomeScreen.style.display = "flex";
    welcomeScreen.style.animation = "none";
    // Trigger reflow for animation restart
    void welcomeScreen.offsetHeight;
    welcomeScreen.style.animation = "fadeIn 0.4s ease";

    // Update suggestion chips
    renderSuggestionChips(data.suggestions);

    // Reset input
    messageInput.value = "";
    updateSendButton();
    messageInput.focus();
}

// ---- Suggestion Chips ----
function renderSuggestionChips(suggestions) {
    suggestionChips.innerHTML = "";
    suggestions.forEach((text) => {
        const chip = document.createElement("button");
        chip.className = "chip";
        chip.textContent = text;
        chip.onclick = () => sendMessage(text);
        suggestionChips.appendChild(chip);
    });
}

// ---- Message Sending ----
function handleSubmit(event) {
    event.preventDefault();
    const text = messageInput.value.trim();
    if (!text || isLoading) return;
    sendMessage(text);
}

function handleKeyDown(event) {
    // Send on Enter (without Shift)
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const text = messageInput.value.trim();
        if (!text || isLoading) return;
        sendMessage(text);
    }
}

async function sendMessage(text) {
    if (isLoading) return;

    // Hide welcome screen on first message
    welcomeScreen.style.display = "none";

    // Add user message to UI and history
    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });

    // Clear input
    messageInput.value = "";
    updateSendButton();
    autoResize(messageInput);

    // Hide suggestion chips after first message
    suggestionChips.innerHTML = "";

    // Show typing indicator
    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                persona: currentPersona,
                messages: conversationHistory,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to get response.");
        }

        const reply = result.reply;

        // Add assistant message to UI and history
        appendMessage("assistant", reply);
        conversationHistory.push({ role: "assistant", content: reply });
    } catch (error) {
        console.error("Chat API error:", error);
        showError(
            error.message || "Could not reach the server. Please try again."
        );
    } finally {
        setLoading(false);
    }
}

// ---- Message Rendering ----
function appendMessage(role, content) {
    const row = document.createElement("div");
    row.className = `message-row ${role}`;

    if (role === "assistant") {
        const avatar = document.createElement("img");
        avatar.className = "message-avatar";
        avatar.src = PERSONA_DATA[currentPersona].avatar;
        avatar.alt = PERSONA_DATA[currentPersona].name;
        avatar.width = 30;
        avatar.height = 30;
        row.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    // Basic markdown-like formatting for bold text
    let formatted = escapeHtml(content);
    // Convert **bold** to <strong>bold</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Convert line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    bubble.innerHTML = formatted;
    row.appendChild(bubble);

    messagesContainer.appendChild(row);
    scrollToBottom();
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    const chatContainer = document.getElementById("chat-container");
    // Small delay to let the DOM update
    requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

// ---- Loading / Typing Indicator ----
function setLoading(loading) {
    isLoading = loading;
    typingIndicator.classList.toggle("hidden", !loading);
    messageInput.disabled = loading;
    sendBtn.disabled = loading;

    if (loading) {
        scrollToBottom();
    }
}

// ---- Input Helpers ----
function updateSendButton() {
    sendBtn.disabled = !messageInput.value.trim() || isLoading;
}

function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
}

// ---- Error Toast ----
function showError(message) {
    errorToastMessage.textContent = message;
    errorToast.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorToast.classList.add("hidden");
    }, 5000);
}
