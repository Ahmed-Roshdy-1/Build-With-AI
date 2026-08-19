<script setup lang="ts">
defineProps<{ hasStarted: boolean }>()
const emit = defineEmits<{ 'new-chat': [] }>()
</script>

<template>
  <header class="relative z-10 shrink-0 flex w-full items-center justify-between px-4 py-3">
    <!-- Brand -->
    <div class="flex items-center gap-2 cursor-pointer hover:bg-[#2f2f2f] px-2 py-1.5 rounded-lg transition-colors text-zinc-200">
      <span class="text-lg font-semibold tracking-tight">ChatGPT Vibe</span>
      <svg
        stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
        stroke-linecap="round" stroke-linejoin="round"
        class="w-4 h-4 text-zinc-400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <!-- New chat button — only visible once conversation has started -->
    <Transition name="fade">
      <button
        v-if="hasStarted"
        type="button"
        title="New chat"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-[#2f2f2f] transition-colors"
        @click="emit('new-chat')"
      >
        <svg
          stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
          stroke-linecap="round" stroke-linejoin="round"
          class="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        New chat
      </button>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
