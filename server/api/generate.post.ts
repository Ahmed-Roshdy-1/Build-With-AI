import { GoogleGenAI } from '@google/genai'

const integrationContext: Record<string, string> = {
  stripe: 'Stripe: use for payment processing, subscriptions, invoices, checkout, and billing workflows.',
  shopify: 'Shopify: use for ecommerce products, orders, customers, inventory, and storefront workflows.',
  gmail: 'Gmail: use for transactional email, outreach, inbox-related workflows, and email notifications.',
  slack: 'Slack: use for team alerts, workflow notifications, approvals, and internal communication.',
  sheets: 'Google Sheets: use for lightweight tabular data, reporting, exports, and collaborative data workflows.'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ messages?: { role: string; text: string }[]; integrations?: string[] }>(event)
  const messages = body?.messages || []
  const integrations = Array.isArray(body?.integrations) ? body.integrations : []

  if (!messages.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Messages are required.'
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

Your job is to turn a product idea into a concise, implementation-ready response, and then chat with the user to refine it.
Prioritize clear architecture, user experience, data flow, API boundaries, and an MVP-first approach.
Do not claim that any integration is actually connected. The integrations below are contextual capabilities only.

SELECTED INTEGRATIONS (Global context for the project):
${selectedContext}

Keep the answer useful and concrete. Avoid generic filler.
`

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })
    
    // Map our generic format to Gemini's expected format
    const contents = messages.map(msg => ({
      role: msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }))

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents,
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