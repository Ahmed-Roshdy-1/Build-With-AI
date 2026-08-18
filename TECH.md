# Technology Awareness: Gemini 3.6 Flash

## What is it?

Gemini 3.6 Flash is a fast Gemini model aimed at modern application workloads where developers want strong model capability without the latency and cost profile of the largest reasoning models.

For this task, it is directly relevant because the product is an AI-assisted builder and needs a responsive text-generation experience.

## How could Stunning use it?

Stunning could use a fast Gemini model for the first-pass product-building loop:

1. Interpret a natural-language product request.
2. Combine it with selected integration context.
3. Generate an implementation plan.
4. Generate starter code or structured artifacts.
5. Iterate on the output through follow-up prompts.

A stronger production architecture could route simple requests to a fast model and reserve deeper reasoning models for complex architecture or debugging tasks.

## Limitations

- Model output is probabilistic and can contain incorrect technical assumptions.
- Preview/current model availability can change, so model IDs should be configurable rather than hard-coded throughout the application.
- AI responses still need validation before generated code is executed or deployed.
- Context size, latency, quotas, and cost need to be monitored in production.
- Giving the model real credentials or unrestricted tools would create a much larger security boundary.

## Would I use it today?

**Yes, for this product.**

The task is centered on an interactive builder, so latency matters. A fast Gemini model is a good default for the conversational planning layer.

I would still keep the model behind a small server-side abstraction so Stunning can switch models, compare quality/cost, or add a second model for harder requests without rewriting the frontend.

## Why this choice fits the submission

The implementation demonstrates the important architectural boundary:

**UI → server API → system instruction + selected context → Gemini**

That boundary gives Stunning a place to add authentication, quotas, observability, caching, model routing, and safety controls later.
