/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Chatbot configuration */
/* All chatbot requests go to the Cloudflare Worker so the OpenAI key stays server-side. */
const workerUrl = "https://resourcecloudflare-worker.jason01.workers.dev/";
const systemPrompt =
  "You are a friendly L'Oréal beauty assistant. Only answer questions about L'Oréal products, routines, ingredients, and beauty recommendations. If the user asks about anything unrelated, politely refuse and say you can only help with L'Oréal products and routines. Keep responses clear, warm, and practical.";

/* Show the opening message */
appendMessage(
  "assistant",
  "Hello! Ask me about L'Oréal products, routines, or recommendations.",
);

function appendMessage(role, text) {
  const message = document.createElement("div");
  message.className = `msg ${role}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  appendMessage("user", userMessage);
  userInput.value = "";
  userInput.focus();

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
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

    appendMessage("ai", assistantReply);
  } catch (error) {
    appendMessage(
      "ai",
      `Sorry, I could not get a response right now. ${error.message}`,
    );
  }
});
