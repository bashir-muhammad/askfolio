# AskFolio

AskFolio is an AI chat MVP. Users can create and switch between chat threads, send messages, and watch assistant replies stream into the conversation.

## Features

- Create chats and switch between them from the sidebar.
- Add user messages to the active chat immediately.
- Receive streamed assistant replies from Google's Gemini API.
- Keep each reply associated with the chat that started the request.


> **Current limitation:** Guest chats are held in session storage and are lost when the browser session ends. Signed-in chat history is stored in a local JSON file, which is not suitable for multi-instance production deployments.

## Requirements

- Node.js 22.x and npm
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

## Azure deployment

The GitHub Actions workflow runs lint, typecheck, and build for pull requests to `main` and pushes to `main` or `feature/*`. Azure deployment runs only after those checks pass: pull requests receive preview environments, and pushes to `main` deploy production. Closing a pull request closes its preview.

To enable deployment:

1. Create an Azure Static Web App on the Free plan without generating an additional GitHub Actions workflow.
2. Add its deployment token as the repository Actions secret `AZURE_STATIC_WEB_APPS_API_TOKEN_LEMON_WATER_0F770BB10`.
3. Configure these runtime application settings on the Static Web App: `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXTAUTH_SECRET`. The placeholder values in the workflow are build-only; do not put production secrets in the workflow.
4. Add `https://<your-app-host>/api/auth/callback/google` as an authorized redirect URI for the Google OAuth client, and set `NEXTAUTH_URL` to the deployed app's origin.
5. The `main` branch requires the `build (22.x)` status check before merging.

This app requires a Next.js server for its API routes and authentication, so it must use hybrid Next.js hosting rather than static export. Azure Static Web Apps' hybrid Next.js support is currently in preview; review its [feature support and limitations](https://learn.microsoft.com/en-us/azure/static-web-apps/nextjs) before relying on it for production. Forked pull requests cannot access the deployment token, so CI runs for them but Azure preview deployment will not.

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
