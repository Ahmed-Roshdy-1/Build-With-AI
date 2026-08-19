import { ref, computed, nextTick } from 'vue'
import type { Message } from '~/types/chat'

/**
 * Manages the full chat session: message history, loading/error state,
 * selected integrations, and communication with the /api/generate endpoint.
 */
export function useChat() {
  const prompt = ref('')
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref('')
  const selected = ref<string[]>(['stripe', 'slack'])
  const messageContainer = ref<HTMLElement | null>(null)

  const hasStarted = computed(() => messages.value.length > 0)

  function toggleIntegration(id: string) {
    selected.value = selected.value.includes(id)
      ? selected.value.filter((item) => item !== id)
      : [...selected.value, id]
  }

  async function scrollToBottom() {
    await nextTick()
    messageContainer.value?.scrollTo({
      top: messageContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }

  async function send() {
    const userText = prompt.value.trim()
    if (!userText || loading.value) return

    prompt.value = ''
    messages.value.push({ id: Date.now().toString(), role: 'user', text: userText })
    await scrollToBottom()

    loading.value = true
    error.value = ''

    try {
      const result = await $fetch<{ text: string }>('/api/generate', {
        method: 'POST',
        body: {
          messages: messages.value.map((m) => ({ role: m.role, text: m.text })),
          integrations: selected.value,
        },
      })

      messages.value.push({ id: Date.now().toString(), role: 'model', text: result.text })
      await scrollToBottom()
    } catch (err: any) {
      error.value = err?.data?.message || 'Something went wrong. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function useExample(example: string) {
    prompt.value = example
    send()
  }

  return {
    // state
    prompt,
    messages,
    loading,
    error,
    selected,
    messageContainer,
    // derived
    hasStarted,
    // actions
    toggleIntegration,
    send,
    useExample,
  }
}
