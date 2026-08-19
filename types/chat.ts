export type MessageRole = 'user' | 'model'

export interface Message {
  id: string
  role: MessageRole
  text: string
}

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  accent: string
}
