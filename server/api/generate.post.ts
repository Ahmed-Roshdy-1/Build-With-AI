import { GoogleGenAI } from '@google/genai'

const integrationContext: Record<string, string> = {
  stripe: 'Stripe: use for payment processing, subscriptions, invoices, checkout, and billing workflows.',
  shopify: 'Shopify: use for ecommerce products, orders, customers, inventory, and storefront workflows.',
  gmail: 'Gmail: use for transactional email, outreach, inbox-related workflows, and email notifications.',
  slack: 'Slack: use for team alerts, workflow notifications, approvals, and internal communication.',
  sheets: 'Google Sheets: use for lightweight tabular data, reporting, exports, and collaborative data workflows.'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ prompt?: string; integrations?: string[] }>(event)
  const prompt = body?.prompt?.trim()
  const integrations = Array.isArray(body?.integrations) ? body.integrations : []

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt is required.'
    })
  }

  if (prompt.length > 3000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt must be 3000 characters or less.'
    })
  }

  const config = useRuntimeConfig()

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY is not configured on the server.'
    })
  }

  const selectedContext = integrations
    .filter((id) => integrationContext[id])
    .map((id) => `- ${integrationContext[id]}`)
    .join('\n') || '- No integrations selected.'

  const systemInstruction = `
You are Stunning's senior full-stack product engineer and vibe-coding copilot.

Your job is to turn a product idea into a concise, implementation-ready response.
Prioritize practical architecture, user experience, data flow, API boundaries, and an MVP-first approach.
Do not claim that any integration is actually connected. The integrations below are contextual capabilities only.

SELECTED INTEGRATIONS:
${selectedContext}

When relevant, structure your response with:
1. Product interpretation
2. Recommended UX
3. Technical approach
4. Data/API flow
5. MVP implementation steps
6. Risks or trade-offs

Keep the answer useful and concrete. Avoid generic filler.
`

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    })

    return {
      text: result.text || 'Gemini returned an empty response.'
    }
  } catch (error: any) {
    console.error('Gemini generation failed:', error)

    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini could not generate a response. Check your API key, model name, and quota.'
    })
  }
})