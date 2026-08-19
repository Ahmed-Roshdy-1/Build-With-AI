<script setup lang="ts">
import { computed } from 'vue'
import { md } from '~/utils/markdown'

const props = defineProps<{
  role: 'user' | 'model'
  text: string
  loading?: boolean
}>()

const renderedContent = computed(() => md.render(props.text))
</script>

<template>
  <div class="w-full text-zinc-100" :class="role === 'user' ? 'flex justify-end' : 'flex justify-start'">

    <!-- User bubble -->
    <div
      v-if="role === 'user'"
      class="bg-[#2f2f2f] text-[15px] leading-relaxed rounded-[22px] px-5 py-2.5 max-w-[70%] whitespace-pre-wrap ml-auto"
    >
      {{ text }}
    </div>
    
    <!-- AI response with avatar -->
    <div v-else-if="!loading" class="flex gap-4 w-full text-[15px] leading-[1.6]">
      <div class="mt-0.5 shrink-0 grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-black shadow-sm">
        ✦
      </div>
      <div
        class="prose prose-invert max-w-full w-full gpt-markdown text-zinc-300"
        v-html="renderedContent"
      />
    </div>

  </div>
</template>

<style>
/* ── Thin scrollbar for code blocks ───────────────────────────────────────── */
.custom-scrollbar::-webkit-scrollbar       { height: 8px; width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,.2); border-radius: 9999px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,.3); }
.custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }

/* ── Prose / markdown overrides ───────────────────────────────────────────── */
.gpt-markdown                         { word-break: break-word; }
.gpt-markdown > :first-child          { margin-top: 0; }
.gpt-markdown > :last-child           { margin-bottom: 0; }
.gpt-markdown p                       { margin-bottom: 1rem; }
.gpt-markdown ul,
.gpt-markdown ol                      { margin-top: .5rem; margin-bottom: 1rem; padding-left: 1.5rem; }
.gpt-markdown h1,
.gpt-markdown h2,
.gpt-markdown h3                      { margin-top: 1.5rem; margin-bottom: .75rem; font-weight: 600; color: #fff; }
.gpt-markdown h3                      { font-size: 1.15em; }

/* Strip prose defaults from inside our custom code boxes */
.gpt-markdown pre                     { margin: 0 !important; padding: 0 !important; background: transparent !important; }
.gpt-markdown code.hljs               { background: transparent !important; padding: 0 !important; }

/* Inline code */
.gpt-markdown *:not(pre) > code {
  background-color: rgba(255,255,255,.1);
  padding: .15rem .3rem;
  border-radius: .375rem;
  font-size: .85em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #ececf1;
}
.gpt-markdown *:not(pre) > code::before,
.gpt-markdown *:not(pre) > code::after { content: ""; }
</style>
