# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

The frontend sends every chatbot request to the Cloudflare Worker, not directly to OpenAI. That keeps the OpenAI API key hidden in the Worker as `env.OPENAI_API_KEY`.

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

Use the Worker URL in `script.js` for the `fetch()` request, and keep the OpenAI call inside `RESOURCE_cloudflare-worker.js`.

Enjoy building your L’Oréal beauty assistant! 💄
