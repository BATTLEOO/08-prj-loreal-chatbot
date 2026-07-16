/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Chatbot configuration */
/* All chatbot requests go to the Cloudflare Worker so the OpenAI key stays server-side. */
const workerUrl = "https://resourcecloudflare-worker.jason01.workers.dev/";
const systemPrompt =
  "You are a friendly L'Oréal beauty assistant. Only answer questions about L'Oréal products, routines, ingredients, and beauty recommendations. If the user asks about anything unrelated, politely refuse and say you can only help with L'Oréal products and routines. Keep responses clear, warm, and practical.";
const chatHistory = [
  { role: "system", content: systemPrompt },
  {
    role: "assistant",
    content:
      "Hello! Ask me about L'Oréal products, routines, or recommendations.",
  },
];

/* Show the opening message */
appendChatMessage(
  "assistant",
  "Hello! Ask me about L'Oréal products, routines, or recommendations.",
);

function appendChatMessage(role, text) {
  const turn = document.createElement("div");
  turn.className = `chat-turn ${role}`;

  const label = document.createElement("div");
  label.className = "chat-label";
  label.textContent = role === "user" ? "You" : "L'Oréal Assistant";
  turn.appendChild(label);

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = text;
  turn.appendChild(bubble);

  chatWindow.appendChild(turn);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  appendChatMessage("user", userMessage);
  chatHistory.push({ role: "user", content: userMessage });
  userInput.value = "";
  userInput.focus();

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: chatHistory,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Something went wrong.");
    }

    const assistantReply = data?.choices?.[0]?.message?.content;

    if (!assistantReply) {
      throw new Error("No assistant response was returned.");
    }

    appendChatMessage("assistant", assistantReply);
    chatHistory.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    appendChatMessage(
      "assistant",
      `Sorry, I could not get a response right now. ${error.message}`,
    );
  }
});
