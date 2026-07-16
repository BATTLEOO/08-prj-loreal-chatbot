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
renderExchange(
  "Hello! Ask me about L'Oréal products, routines, or recommendations.",
  "",
  true,
);

function appendMessage(role, text) {
  const message = document.createElement("div");
  message.className = `msg ${role}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderExchange(userQuestion, assistantReply, isGreeting = false) {
  chatWindow.innerHTML = "";

  const exchange = document.createElement("div");
  exchange.className = "exchange";

  if (!isGreeting) {
    const questionLabel = document.createElement("div");
    questionLabel.className = "exchange-label";
    questionLabel.textContent = "You asked";
    exchange.appendChild(questionLabel);
  }

  const questionText = document.createElement("div");
  questionText.className = "exchange-question";
  questionText.textContent = userQuestion;
  exchange.appendChild(questionText);

  if (assistantReply) {
    const answerLabel = document.createElement("div");
    answerLabel.className = "exchange-label exchange-label-answer";
    answerLabel.textContent = "L'Oréal Assistant";
    exchange.appendChild(answerLabel);

    const answerText = document.createElement("div");
    answerText.className = "exchange-answer";
    answerText.textContent = assistantReply;
    exchange.appendChild(answerText);
  }

  chatWindow.appendChild(exchange);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

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

    renderExchange(userMessage, assistantReply);
    chatHistory.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    renderExchange(
      userMessage,
      `Sorry, I could not get a response right now. ${error.message}`,
    );
  }
});
