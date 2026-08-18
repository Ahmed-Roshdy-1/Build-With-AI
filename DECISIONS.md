# Decisions

## What I improved in the 60-minute production pass

### 1. Kept the API key server-side

The Gemini SDK is only used inside the Nuxt server route. The browser never receives `GEMINI_API_KEY`.

This is the most important security decision for a real deployment.

### 2. Added input validation

The API rejects an empty prompt and prompts longer than 3,000 characters.

This prevents accidental or unnecessarily expensive requests.

### 3. Made integrations explicit context

Each dummy integration has a stable ID and a small description. The backend converts selected IDs into a dedicated section of the Gemini system instruction.

This makes the assignment requirement easy to inspect and test.

### 4. Added useful failure states

The UI has loading, validation, and API error states instead of silently failing.

### 5. Focused the UX on one core action

The product has one obvious loop:

**Describe → choose context → generate → inspect result**

I intentionally avoided extra navigation and dashboard complexity.

## What I intentionally left out

### Authentication

There is no account system because it is not required by the task.

### Database

There is no persistence for prompts or generated responses. For an evaluation task, keeping the architecture small makes the core behavior easier to understand.

### Real integrations

Stripe, Shopify, Gmail, Slack, and Google Sheets are deliberately mocked as AI context. No OAuth, webhooks, or external API calls are implemented.

### Streaming

The current version waits for the completed Gemini response. Streaming would improve perceived latency, but it was not necessary to prove the end-to-end requirement.

### Markdown rendering

The response is displayed as text rather than introducing a full markdown renderer and its security considerations.

## Biggest production risk

**Uncontrolled AI usage and cost.**

A public AI endpoint can be abused through high request volume or very large prompts. In production I would put authentication/rate limiting in front of the endpoint, enforce server-side quotas, add request size limits, log token usage, and monitor Gemini errors and latency.

A second important risk is prompt injection if future versions allow user-controlled external content or real integration data to become model context. Integration context should be strongly separated from untrusted content and sensitive credentials should never be inserted into prompts.
