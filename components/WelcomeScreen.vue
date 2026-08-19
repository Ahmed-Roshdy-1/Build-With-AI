<script setup lang="ts">
defineProps<{ examples: string[] }>()
const emit = defineEmits<{ useExample: [example: string] }>()
</script>

<template>
  <div class="max-w-3xl w-full flex flex-col items-center text-center -mt-16">
    <!-- Logo mark -->
    <div class="grid h-16 w-16 place-items-center rounded-full bg-white text-3xl font-black text-black shadow-lg mb-6">
      ✦
    </div>

    <h1 class="text-2xl font-semibold mb-8 text-white">How can I help you today?</h1>

    <!-- Example-prompt cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
      <button
        v-for="example in examples"
        :key="example"
        type="button"
        class="flex items-center justify-between text-left p-4 rounded-xl border border-zinc-700 hover:bg-[#2f2f2f] text-sm text-zinc-300 transition-colors"
        @click="emit('useExample', example)"
      >
        <span>{{ example }}</span>
        <svg
          stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
          stroke-linecap="round" stroke-linejoin="round"
          class="w-4 h-4 text-zinc-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  </div>
</template>
