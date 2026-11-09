# AskFolio

AskFolio is an AI chat MVP. Users can create and switch between chat threads, send messages, and watch assistant replies stream into the conversation.

## Features

- Create chats and switch between them from the sidebar.
- Add user messages to the active chat immediately.
- Receive streamed assistant replies from Google's Gemini API.
- Keep each reply associated with the chat that started the request.


> **Current limitation:** Chats are held in client-side memory only. They are lost when the page is refreshed, and conversations are not yet saved to local storage or a backend. Each API request sends only the latest user message; prior messages in the thread are not sent as conversation context.

## Requirements

- Node.js and npm
- A Google Gemini API key

## Getting started

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root and add your API key:

```bash
GEMINI_API_KEY=your-gemini-api-key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Message flow

1. The user submits a message. The client adds it to the active chat and creates a chat if needed.
2. The input box sends the message content to `POST /api/chat`.
3. The route requests a streamed response from Gemini and streams text chunks back to the client.
4. The client creates an assistant message and updates it as each chunk arrives.
5. The assistant message remains in the chat that initiated the request, even if the user switches chats.

## Project structure

- `src/app/page.tsx` — main chat layout.
- `src/app/api/chat/route.ts` — Gemini streaming endpoint.
- `src/components/` — chat input, message list, sidebar, and shared UI.
- `src/store/chat-store.ts` — in-memory chat and message state.

## Scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Build the production app
npm run start  # Start the production server
```
