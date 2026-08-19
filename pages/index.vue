<script setup lang="ts">
import { useChat } from '~/composables/useChat'
import { INTEGRATIONS, EXAMPLE_PROMPTS } from '~/constants/integrations'
import AppHeader       from '~/components/AppHeader.vue'
import WelcomeScreen   from '~/components/WelcomeScreen.vue'
import ChatMessage     from '~/components/ChatMessage.vue'
import TypingIndicator from '~/components/TypingIndicator.vue'
import ChatInput       from '~/components/ChatInput.vue'

const {
  prompt, messages, loading, error,
  selected, messageContainer, hasStarted,
  toggleIntegration, send, useExample,
} = useChat()
</script>

<template>
  <main class="flex h-screen flex-col overflow-hidden bg-[#212121] text-zinc-100 font-sans">

    <AppHeader />

    <!-- ── Chat / Welcome area ──────────────────────────────────────────────── -->
    <section
      ref="messageContainer"
      class="relative z-10 flex-1 overflow-y-auto px-4"
      :class="!hasStarted ? 'flex items-center justify-center' : 'pb-8'"
    >
      <!-- Empty state -->
      <WelcomeScreen
        v-if="!hasStarted"
        :examples="EXAMPLE_PROMPTS"
        @use-example="useExample"
      />

      <!-- Message list -->
      <div v-else class="max-w-3xl mx-auto flex flex-col pt-8 space-y-8">
        <ChatMessage
          v-for="msg in messages"
          :key="msg.id"
          :role="msg.role"
          :text="msg.text"
        />

        <TypingIndicator v-if="loading" />

        <div
          v-if="error"
          class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200 mt-4"
        >
          {{ error }}
        </div>
      </div>
    </section>

    <!-- ── Input bar ────────────────────────────────────────────────────────── -->
    <ChatInput
      v-model="prompt"
      :loading="loading"
      :integrations="INTEGRATIONS"
      :selected="selected"
      @send="send"
      @toggle-integration="toggleIntegration"
    />

  </main>
</template>