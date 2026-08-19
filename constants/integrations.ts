import type { Integration } from '~/types/chat'

export const INTEGRATIONS: Integration[] = [
  { id: 'stripe',  name: 'Stripe',        description: 'Payments & billing',   icon: 'S', accent: 'from-violet-500 to-indigo-500' },
  { id: 'shopify', name: 'Shopify',       description: 'Store & products',      icon: '⌁', accent: 'from-emerald-400 to-green-600' },
  { id: 'gmail',   name: 'Gmail',         description: 'Email & outreach',      icon: 'M', accent: 'from-red-400 to-orange-500'    },
  { id: 'slack',   name: 'Slack',         description: 'Team notifications',    icon: '✣', accent: 'from-pink-500 to-cyan-400'     },
  { id: 'sheets',  name: 'Google Sheets', description: 'Tables & data',         icon: '▦', accent: 'from-green-400 to-emerald-600' },
]

export const EXAMPLE_PROMPTS: string[] = [
  'Build a customer feedback dashboard',
  'Create a SaaS onboarding flow',
  'Build an AI sales assistant',
]
