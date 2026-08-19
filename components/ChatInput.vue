<script setup lang="ts">
import type { Integration } from '~/types/chat'

defineProps<{
  modelValue: string
  loading: boolean
  streaming: boolean
  integrations: Integration[]
  selected: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  stop: []
  toggleIntegration: [id: string]
}>()
</script>

<template>
  <section class="relative z-20 shrink-0 px-4 pb-6 pt-2 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent">
    <div class="mx-auto max-w-3xl">

      <!-- Input box -->
      <div class="relative flex flex-col w-full rounded-[26px] bg-[#2f2f2f] shadow-lg border border-zinc-700/50 overflow-hidden">

        <!-- Integration context pills -->
        <div class="flex items-center gap-2 overflow-x-auto px-4 pt-3 pb-1 no-scrollbar whitespace-nowrap">
          <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-widest shrink-0 mr-1">Context</span>

          <button
            v-for="integration in integrations"
            :key="integration.id"
            type="button"
            class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors border"
            :class="selected.includes(integration.id)
              ? 'bg-zinc-700 border-zinc-600 text-white'
              : 'bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-200'"
            @click="emit('toggleIntegration', integration.id)"
          >
            <span
              class="font-bold font-mono text-[10px]"
              :class="selected.includes(integration.id) ? 'text-white' : ''"
            >
              {{ integration.icon }}
            </span>
            {{ integration.name }}
          </button>
        </div>

        <!-- Textarea -->
        <textarea
          :value="modelValue"
          rows="1"
          maxlength="3000"
          :disabled="loading"
          class="w-full resize-none bg-transparent pb-3.5 pt-2 pl-5 pr-14 text-[15px] leading-6 text-white outline-none placeholder:text-zinc-400 min-h-[44px] max-h-[200px] disabled:opacity-60"
          placeholder="Message Vibe Coder..."
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          @keydown.enter.exact.prevent="!loading && emit('send')"
        />

        <!-- Stop button (while streaming) -->
        <button
          v-if="streaming"
          id="stop-button"
          type="button"
          title="Stop generating"
          class="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition-colors focus:outline-none"
          @click="emit('stop')"
        >
          <!-- Stop square icon -->
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        </button>

        <!-- Send button (when not streaming) -->
        <button
          v-else
          id="send-button"
          type="button"
          :disabled="loading || !modelValue.trim()"
          class="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors focus:outline-none"
          :class="(loading || !modelValue.trim())
            ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-zinc-200'"
          @click="emit('send')"
        >
          <!-- Loading spinner -->
          <span
            v-if="loading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"
          />
          <!-- Arrow-up icon -->
          <svg
            v-else
            stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
            stroke-linecap="round" stroke-linejoin="round"
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>

      <!-- Disclaimer -->
      <div class="mt-2 text-center text-xs text-zinc-400 px-4">
        Vibe Coder can make mistakes. Consider verifying important information.
      </div>
    </div>
  </section>
</template>
