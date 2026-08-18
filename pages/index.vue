<script setup lang="ts">
type Integration = {
  id: string
  name: string
  description: string
  icon: string
  accent: string
}

const integrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payments & billing',
    icon: 'S',
    accent: 'from-violet-500 to-indigo-500'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Store & products',
    icon: '⌁',
    accent: 'from-emerald-400 to-green-600'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email & outreach',
    icon: 'M',
    accent: 'from-red-400 to-orange-500'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team notifications',
    icon: '✣',
    accent: 'from-pink-500 to-cyan-400'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Tables & data',
    icon: '▦',
    accent: 'from-green-400 to-emerald-600'
  }
]

const prompt = ref('')
const selected = ref<string[]>(['stripe', 'slack'])
const response = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

const examples = [
  'Build a customer feedback dashboard',
  'Create a SaaS onboarding flow',
  'Build an AI sales assistant'
]

const selectedIntegrations = computed(() =>
  integrations.filter((integration) => selected.value.includes(integration.id))
)

function toggleIntegration(id: string) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

async function generate() {
  if (!prompt.value.trim() || loading.value) return

  loading.value = true
  error.value = ''
  response.value = ''

  try {
    const result = await $fetch<{ text: string }>('/api/generate', {
      method: 'POST',
      body: {
        prompt: prompt.value.trim(),
        integrations: selected.value
      }
    })

    response.value = result.text
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function useExample(example: string) {
  prompt.value = example
}

async function copyResponse() {
  if (!response.value) return
  await navigator.clipboard.writeText(response.value)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[#08090d] text-white">
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute left-1/2 top-[-18rem] h-[36rem] w-[55rem] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div class="absolute bottom-[-22rem] left-[-10rem] h-[36rem] w-[36rem] rounded-full bg-indigo-600/10 blur-3xl" />
    </div>

    <header class="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-black shadow-lg shadow-white/10">S</div>
        <span class="text-sm font-semibold tracking-tight">Stunning AI Builder</span>
      </div>

      <div class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 sm:flex">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
        Gemini powered
      </div>
    </header>

    <section class="relative mx-auto max-w-5xl px-5 pb-20 pt-12 text-center lg:px-8 lg:pt-20">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
        <span>✦</span>
        Turn an idea into a build plan
      </div>

      <h1 class="mx-auto max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
        Build what you mean.
        <span class="bg-gradient-to-r from-fuchsia-300 via-white to-indigo-300 bg-clip-text text-transparent">Not what you type.</span>
      </h1>

      <p class="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
        Describe the product you want. Pick the tools it should understand. Gemini turns your idea into a practical implementation direction.
      </p>

      <div class="mx-auto mt-10 max-w-4xl text-left">
        <div class="rounded-3xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div class="rounded-[1.35rem] bg-[#0d0f15] p-5 sm:p-6">
            <label class="mb-3 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              What do you want to build?
            </label>

            <textarea
              v-model="prompt"
              rows="5"
              maxlength="3000"
              class="w-full resize-none bg-transparent text-lg leading-8 text-white outline-none placeholder:text-zinc-600"
              placeholder="Example: Build a modern customer portal where users can track invoices, pay outstanding balances, and get Slack alerts..."
              @keydown.meta.enter="generate"
              @keydown.ctrl.enter="generate"
            />

            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="example in examples"
                :key="example"
                type="button"
                class="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                @click="useExample(example)"
              >
                {{ example }}
              </button>
            </div>

            <div class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div class="mb-2 text-xs font-medium text-zinc-400">Context integrations</div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="integration in integrations"
                    :key="integration.id"
                    type="button"
                    class="group flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition"
                    :class="selected.includes(integration.id)
                      ? 'border-white/20 bg-white/[0.09] text-white'
                      : 'border-white/8 bg-white/[0.02] text-zinc-500 hover:border-white/15 hover:text-zinc-300'"
                    @click="toggleIntegration(integration.id)"
                  >
                    <span
                      class="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white"
                      :class="integration.accent"
                    >
                      {{ integration.icon }}
                    </span>
                    {{ integration.name }}
                    <span v-if="selected.includes(integration.id)" class="text-zinc-300">✓</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                :disabled="loading || !prompt.trim()"
                class="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                @click="generate"
              >
                <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                <span v-else>Generate</span>
                <span v-if="!loading">⌘↵</span>
              </button>
            </div>
          </div>
        </div>

        <p class="mt-3 text-center text-xs text-zinc-600">
          {{ prompt.length }}/3000 · Selected integrations become model context, not live connections.
        </p>
      </div>
    </section>

    <section v-if="loading || error || response" class="relative mx-auto max-w-4xl px-5 pb-20 lg:px-8">
      <div class="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <div class="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Gemini response</div>
            <div class="mt-1 text-sm text-zinc-400">
              Context:
              <span v-for="(integration, index) in selectedIntegrations" :key="integration.id">
                {{ integration.name }}<span v-if="index < selectedIntegrations.length - 1">, </span>
              </span>
              <span v-if="!selectedIntegrations.length">none</span>
            </div>
          </div>

          <button
            v-if="response"
            type="button"
            class="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            @click="copyResponse"
          >
            {{ copied ? 'Copied ✓' : 'Copy' }}
          </button>
        </div>

        <div v-if="loading" class="space-y-3">
          <div class="h-4 w-11/12 animate-pulse rounded bg-white/10" />
          <div class="h-4 w-10/12 animate-pulse rounded bg-white/10" />
          <div class="h-4 w-8/12 animate-pulse rounded bg-white/10" />
        </div>

        <div v-else-if="error" class="rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm leading-6 text-red-200">
          {{ error }}
        </div>

        <article v-else class="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-7 text-zinc-300">
          {{ response }}
        </article>
      </div>
    </section>

    <footer class="relative mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/5 px-5 py-7 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <span>Built as a Full-Stack Vibe Coder submission.</span>
      <span>Nuxt · Tailwind · Gemini</span>
    </footer>
  </main>
</template>