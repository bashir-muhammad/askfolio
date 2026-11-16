# AskFolio

AskFolio is an AI chat MVP. Users can create and switch between chat threads, send messages, and watch assistant replies stream into the conversation.

## Features

- Create chats and switch between them from the sidebar.
- Add user messages to the active chat immediately.
- Receive streamed assistant replies from Google's Gemini API.
- Keep each reply associated with the chat that started the request.


> **Current limitation:** Guest chats are held in session storage and are lost when the browser session ends. Signed-in chat history is stored in a local JSON file, which is not suitable for multi-instance production deployments.

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
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

The OAuth credentials and `NEXTAUTH_SECRET` are required when running the app. CI uses build-only placeholders so pull request builds do not need access to production secrets; configure real values in the deployment environment.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Message flow

1. The user submits a message. The client adds it to the active chat and creates a chat if needed.
2. The input box sends the message content and active thread ID to `POST /api/chat`. Guest requests also include the current thread history.
3. The route loads the signed-in user's thread history (or uses the guest thread history), sends up to 20,000 characters of the most recent complete turns plus the new message to Gemini, and streams response chunks back to the client.
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
