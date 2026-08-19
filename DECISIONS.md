# Decisions

## What I improved in the latest UI/UX passes

### 1. Replicated Industry-Standard Chat UX
Following an initial pass with a "vibe coding" aesthetic, the layout was completely restructured into a pixel-perfect standard conversational AI interface (similar to ChatGPT).
- Features a bottom-pinned text area.
- User requests map to right-aligned rounded message bubbles.
- AI responses stream cleanly across the left.

### 2. High-Quality Markdown and Code Blocks
I overhauled text handling completely. Instead of raw bindings `{{ msg.text }}`, the system now uses `markdown-it` combined with `highlight.js`.
- Generates fully styled syntax-highlighted code blocks for over 180 languages.
- Implemented the iconic "dark code-block header" with a one-click clipboard copy button.
- Custom WebKit scrollbar overlays injected into `app.vue` ensure nested code overflow never breaks outer styling.

### 3. Kept the API key server-side
The Gemini SDK is explicitly kept inside the Nuxt server route. The browser never receives `GEMINI_API_KEY`.

### 4. Added input validation
The API rejects empty prompts or prompts longer than 3,000 characters to prevent unwanted payload expenditures.

### 5. Hidden but Powerful Integration Toggle
The dummy integrations are preserved from the requirements. They sit as subtle toggleable pills within the `textarea` container. Selecting them dynamically updates the `server/api/generate.post.ts` system prompt configuration, fulfilling the core prompt requirements while avoiding UI clutter.

---

## What I intentionally left out

### Real backend databases
No persistence logic is configured. Conversations wipe on browser refresh. For an evaluation MVP, stateless history arrays held in the Vue `<script setup>` define the most direct understanding of the core requirement.

### Streaming responses
The current execution awaits the full return packet from Gemini. While streaming vastly improves perceived latency to users (TTFB), blocking for the full markdown payload was safer to execute rapidly without needing complicated SSE parsers on the frontend to inject into `markdown-it` chunk-by-chunk.

### Authentication
No login flows exist because it's not strictly required in the prompt.

---

## Biggest production risk

**Arbitrary AI Cost and Prompt Injection**
Placing an unfiltered text box that calls an external LLM publicly exposes the owner to significant API scraping, spam, or prompt injection. 
If mock integrations ever become real, prompt injection is a major risk, as a malicious user might attempt to exfiltrate Stripe or Shopify data embedded in the hidden context layer.

A strong authentication wrapper and robust rate limit architecture (via Upstash or Redis) would be strictly required before merging to `main`.
