# Stunning AI Builder

A full-stack vibe-coding submission built with **Nuxt 3 + Tailwind CSS + Gemini API**.

The app lets a user describe what they want to build, choose dummy integrations, and send both pieces of context to Gemini. The selected integrations are injected into the **server-side system instruction** before the model call.

## Features

- Polished responsive landing page
- Prompt input with example prompts
- Dummy integration selector:
  - Stripe
  - Shopify
  - Gmail
  - Slack
  - Google Sheets
- Server-side Gemini API integration
- Selected integrations dynamically change the system prompt
- Loading, validation, and error states
- Copy response action
- No API key exposed to the browser

## Requirements

- Node.js 18+
- Gemini API key from Google AI Studio

## Run locally

```bash
npm install
cp .env.example .env
```

Add your key to `.env`:

```env
GEMINI_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

Open the local URL shown by Nuxt.

## Architecture

```text
Browser
  |
  | POST /api/generate
  | { prompt, integrations }
  v
Nuxt server API
  |
  | builds systemInstruction
  | injects selected integration context
  v
Gemini API
  |
  v
AI response
  |
  v
Browser
```

The Gemini SDK is used only on the server. This keeps `GEMINI_API_KEY` out of client-side JavaScript.

## Important implementation detail

The assignment specifically requires selected integrations to affect the system prompt.

That happens in:

`server/api/generate.post.ts`

The server maps selected integration IDs to contextual descriptions and interpolates them into `systemInstruction` before calling Gemini.

## Production notes

For a production version, I would add authentication, rate limiting, request observability, structured logging, abuse protection, persistent prompt history, and streaming responses.
