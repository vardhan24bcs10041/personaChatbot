const API_BASE_URL = "https://personachatbot-2iwf.onrender.com";

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

let currentPersona = "anshuman";
let conversationHistory = [];
let isLoading = false;

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

document.addEventListener("DOMContentLoaded", () => {
    switchPersona("anshuman");
    messageInput.addEventListener("input", updateSendButton);
});

function switchPersona(persona) {
    if (isLoading) return;

    currentPersona = persona;
    conversationHistory = [];
    const data = PERSONA_DATA[persona];

    document.body.className = `persona-${persona}`;

    document.querySelectorAll(".persona-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.persona === persona);
    });

    badgeAvatar.src = data.avatar;
    badgeName.textContent = data.name;

    welcomeAvatar.src = data.avatar;
    welcomeName.textContent = data.name;
    welcomeTitle.textContent = data.title;

    typingAvatar.src = data.avatar;

    messagesContainer.innerHTML = "";
    welcomeScreen.style.display = "flex";
    welcomeScreen.style.animation = "none";
    void welcomeScreen.offsetHeight;
    welcomeScreen.style.animation = "fadeIn 0.4s ease";

    renderSuggestionChips(data.suggestions);

    messageInput.value = "";
    updateSendButton();
    messageInput.focus();
}

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

function handleSubmit(event) {
    event.preventDefault();
    const text = messageInput.value.trim();
    if (!text || isLoading) return;
    sendMessage(text);
}

function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const text = messageInput.value.trim();
        if (!text || isLoading) return;
        sendMessage(text);
    }
}

async function sendMessage(text) {
    if (isLoading) return;

    welcomeScreen.style.display = "none";

    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });

    messageInput.value = "";
    updateSendButton();
    autoResize(messageInput);

    suggestionChips.innerHTML = "";

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

    let formatted = escapeHtml(content);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
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
    requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

function setLoading(loading) {
    isLoading = loading;
    typingIndicator.classList.toggle("hidden", !loading);
    messageInput.disabled = loading;
    sendBtn.disabled = loading;

    if (loading) {
        scrollToBottom();
    }
}

function updateSendButton() {
    sendBtn.disabled = !messageInput.value.trim() || isLoading;
}

function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
}

function showError(message) {
    errorToastMessage.textContent = message;
    errorToast.classList.remove("hidden");

    setTimeout(() => {
        errorToast.classList.add("hidden");
    }, 5000);
}
