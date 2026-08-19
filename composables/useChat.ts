import { ref, computed, nextTick } from 'vue'
import type { Message } from '~/types/chat'

/**
 * Manages the full chat session: message history, streaming state,
 * selected integrations, abort control, and the /api/generate SSE stream.
 */
export function useChat() {
  const prompt           = ref('')
  const messages         = ref<Message[]>([])
  const loading          = ref(false)
  const error            = ref('')
  const selected         = ref<string[]>(['stripe', 'slack'])
  const messageContainer = ref<HTMLElement | null>(null)

  /** Tracks whether the model is actively streaming text into the last message */
  const streaming = ref(false)

  /** AbortController so the user can cancel mid-stream */
  let abortController: AbortController | null = null

  const hasStarted = computed(() => messages.value.length > 0)

  // ── Helpers ──────────────────────────────────────────────────────────────

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

  /** Append text to the last model message (used while streaming) */
  function appendToLastMessage(text: string) {
    const last = messages.value[messages.value.length - 1]
    if (last && last.role === 'model') {
      last.text += text
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Stop an in-progress generation */
  function stop() {
    abortController?.abort()
    abortController = null
    loading.value   = false
    streaming.value = false
  }

  /** Start a brand-new conversation */
  function newChat() {
    stop()
    messages.value = []
    prompt.value   = ''
    error.value    = ''
  }

  async function send() {
    const userText = prompt.value.trim()
    if (!userText || loading.value) return

    prompt.value = ''
    error.value  = ''

    messages.value.push({ id: Date.now().toString(), role: 'user', text: userText })
    await scrollToBottom()

    // Placeholder message that we'll fill token-by-token
    messages.value.push({ id: (Date.now() + 1).toString(), role: 'model', text: '' })
    await scrollToBottom()

    loading.value   = true
    streaming.value = true
    abortController = new AbortController()

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send history minus the empty placeholder
          messages:     messages.value.slice(0, -1).map((m) => ({ role: m.role, text: m.text })),
          integrations: selected.value,
        }),
        signal: abortController.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`Server error ${response.status}`)
      }

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE lines
        const lines   = buffer.split('\n')
        buffer        = lines.pop() ?? '' // keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const parsed = JSON.parse(payload) as { text?: string; error?: string }
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              appendToLastMessage(parsed.text)
              await scrollToBottom()
            }
          } catch {
            // malformed chunk — ignore
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // User stopped it — leave partial text, just mark done
      } else {
        // Remove the empty placeholder and show the error
        messages.value.pop()
        error.value = err?.message || 'Something went wrong. Please try again.'
      }
    } finally {
      loading.value   = false
      streaming.value = false
      abortController = null
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
    streaming,
    error,
    selected,
    messageContainer,
    // derived
    hasStarted,
    // actions
    toggleIntegration,
    send,
    stop,
    newChat,
    useExample,
  }
}
