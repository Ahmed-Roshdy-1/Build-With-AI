<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ChatMessage from '~/components/ChatMessage.vue'

type Integration = {
  id: string
  name: string
  description: string
  icon: string
  accent: string
}

const integrations: Integration[] = [
  { id: 'stripe', name: 'Stripe', description: 'Payments & billing', icon: 'S', accent: 'from-violet-500 to-indigo-500' },
  { id: 'shopify', name: 'Shopify', description: 'Store & products', icon: '⌁', accent: 'from-emerald-400 to-green-600' },
  { id: 'gmail', name: 'Gmail', description: 'Email & outreach', icon: 'M', accent: 'from-red-400 to-orange-500' },
  { id: 'slack', name: 'Slack', description: 'Team notifications', icon: '✣', accent: 'from-pink-500 to-cyan-400' },
  { id: 'sheets', name: 'Google Sheets', description: 'Tables & data', icon: '▦', accent: 'from-green-400 to-emerald-600' }
]

type Message = {
  id: string
  role: 'user' | 'model'
  text: string
}

const prompt = ref('')
const selected = ref<string[]>(['stripe', 'slack'])
const messages = ref<Message[]>([])
const loading = ref(false)
const error = ref('')

const examples = [
  'Build a customer feedback dashboard',
  'Create a SaaS onboarding flow',
  'Build an AI sales assistant'
]

const messageContainer = ref<HTMLElement | null>(null)

const hasStarted = computed(() => messages.value.length > 0)

function toggleIntegration(id: string) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTo({
      top: messageContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

async function send() {
  if (!prompt.value.trim() || loading.value) return

  const userText = prompt.value.trim()
  prompt.value = ''
  
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    text: userText
  })
  
  await scrollToBottom()
  
  loading.value = true
  error.value = ''

  try {
    const result = await $fetch<{ text: string }>('/api/generate', {
      method: 'POST',
      body: {
        messages: messages.value.map(m => ({ role: m.role, text: m.text })),
        integrations: selected.value
      }
    })

    messages.value.push({
      id: Date.now().toString(),
      role: 'model',
      text: result.text
    })
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
</script>

<template>
  <main class="flex h-screen flex-col overflow-hidden bg-[#212121] text-zinc-100 relative font-sans">
    
    <!-- Topbar -->
    <header class="relative z-10 shrink-0 flex w-full items-center justify-between px-4 py-3">
      <div class="flex items-center gap-2 cursor-pointer hover:bg-[#2f2f2f] px-2 py-1.5 rounded-lg transition-colors text-zinc-200">
        <span class="text-lg font-semibold tracking-tight">ChatGPT Vibe</span>
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
      </div>
    </header>

    <!-- Chat Area -->
    <section 
      ref="messageContainer"
      class="relative z-10 flex-1 overflow-y-auto px-4"
      :class="!hasStarted ? 'flex items-center justify-center' : 'pb-8'"
    >
      <div v-if="!hasStarted" class="max-w-3xl w-full flex flex-col items-center text-center -mt-16">
        <div class="grid h-16 w-16 place-items-center rounded-full bg-white text-3xl font-black text-black shadow-lg mb-6">
          ✦
        </div>
        <h1 class="text-2xl font-semibold mb-8 text-white">How can I help you today?</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
          <button
            v-for="example in examples"
            :key="example"
            type="button"
            class="flex items-center justify-between text-left p-4 rounded-xl border border-zinc-700 hover:bg-[#2f2f2f] text-sm text-zinc-300 transition-colors"
            @click="useExample(example)"
          >
            <span>{{ example }}</span>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
      
      <div v-else class="max-w-3xl mx-auto flex flex-col pt-8 space-y-8">
        <ChatMessage 
          v-for="msg in messages" 
          :key="msg.id" 
          :role="msg.role" 
          :text="msg.text" 
        />
        
        <div v-if="loading" class="flex gap-4 w-full max-w-[85%] text-[15px] leading-7 items-center">
          <div class="mt-0.5 shrink-0 grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-black">
            ✦
          </div>
          <div class="flex gap-1">
            <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
            <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0.4s;"></span>
          </div>
        </div>
        
        <div v-if="error" class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200 mt-4">
          {{ error }}
        </div>
      </div>
    </section>

    <!-- Input Area -->
    <section class="relative z-20 shrink-0 px-4 pb-6 pt-2 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent">
      <div class="mx-auto max-w-3xl">
        <div class="relative flex flex-col w-full rounded-[26px] bg-[#2f2f2f] shadow-lg border border-zinc-700/50 overflow-hidden">
          
          <div class="flex items-center gap-2 overflow-x-auto px-4 pt-3 pb-1 no-scrollbar whitespace-nowrap">
            <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-widest shrink-0 mr-1">Context</span>
            <button
              v-for="integration in integrations"
              :key="integration.id"
              @click="toggleIntegration(integration.id)"
              class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors border"
              :class="selected.includes(integration.id) ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-200'"
            >
              <span class="font-bold font-mono text-[10px]" :class="selected.includes(integration.id) ? 'text-white' : ''">
                {{ integration.icon }}
              </span>
              {{ integration.name }}
            </button>
          </div>

          <textarea
            v-model="prompt"
            rows="1"
            maxlength="3000"
            class="w-full resize-none bg-transparent pb-3.5 pt-2 pl-5 pr-14 text-[15px] leading-6 text-white outline-none placeholder:text-zinc-400 min-h-[44px] max-h-[200px]"
            placeholder="Message ChatGPT..."
            @keydown.enter.exact.prevent="send"
          />

          <!-- Send btn -->
          <button
            type="button"
            :disabled="loading || !prompt.trim()"
            class="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors focus:outline-none"
            :class="(loading || !prompt.trim()) ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'"
            @click="send"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <svg v-else stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </button>
        </div>
        
        <div class="mt-2 text-center text-xs text-zinc-400 px-4">
          ChatGPT can make mistakes. Consider verifying important information.
        </div>
      </div>
    </section>
  </main>
</template>