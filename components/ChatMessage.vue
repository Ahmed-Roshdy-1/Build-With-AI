<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' 

const props = defineProps<{
  role: 'user' | 'model'
  text: string
}>()

const md = new MarkdownIt({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlightedCode = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        const encodedStr = encodeURIComponent(str)
        return `
          <div class="rounded-lg mb-6 flex flex-col overflow-hidden bg-[#000000] border border-zinc-800">
            <div class="flex items-center justify-between px-4 py-2 bg-[#2f2f2f] text-xs font-sans text-zinc-300">
              <span class="text-zinc-400 font-semibold">${lang}</span>
              <button 
                class="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" 
                onclick="navigator.clipboard.writeText(decodeURIComponent('${encodedStr}')); const t = this.innerText; this.innerText = 'Copied!'; setTimeout(() => this.innerText = t, 2000);"
              >
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                Copy code
              </button>
            </div>
            <div class="p-4 overflow-x-auto text-[14px] font-mono text-zinc-100 leading-relaxed custom-scrollbar">
              <pre><code class="hljs language-${lang}">${highlightedCode}</code></pre>
            </div>
          </div>
        `
      } catch (__) {}
    }
    
    return `
      <div class="rounded-lg mb-6 flex flex-col overflow-hidden bg-[#000000] border border-zinc-800">
        <div class="flex items-center justify-between px-4 py-2 bg-[#2f2f2f] text-xs font-sans text-zinc-300">
          <span class="text-zinc-400 font-semibold">code</span>
          <button 
            class="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" 
            onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(str)}')); const t = this.innerText; this.innerText = 'Copied!'; setTimeout(() => this.innerText = t, 2000);"
          >
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            Copy code
          </button>
        </div>
        <div class="p-4 overflow-x-auto text-[14px] font-mono text-zinc-100 leading-relaxed custom-scrollbar">
          <pre><code>${md.utils.escapeHtml(str)}</code></pre>
        </div>
      </div>
    `
  }
})

const renderedContent = computed(() => {
  return md.render(props.text)
})
</script>

<template>
  <div class="w-full text-zinc-100" :class="role === 'user' ? 'flex justify-end' : 'flex justify-start'">
    <!-- User Message Format -->
    <div v-if="role === 'user'" class="bg-[#2f2f2f] text-[15px] leading-relaxed rounded-[22px] px-5 py-2.5 max-w-[70%] whitespace-pre-wrap ml-auto">
      {{ text }}
    </div>
    
    <!-- AI Message Format -->
    <div v-else class="flex gap-4 w-full text-[15px] leading-[1.6]">
      <div class="mt-0.5 shrink-0 grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-black shadow-sm">
        ✦
      </div>
      <div 
        class="prose prose-invert max-w-full w-full gpt-markdown text-zinc-300"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<style>
/* Custom thin scrollbar for code blocks */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.custom-scrollbar::-webkit-scrollbar-corner {
  background: transparent;
}

/* Adjust prose formatting to closely match classic AI outputs */
.gpt-markdown {
  word-break: break-word;
}
.gpt-markdown > :first-child {
  margin-top: 0;
}
.gpt-markdown > :last-child {
  margin-bottom: 0;
}
.gpt-markdown p {
  margin-bottom: 1rem;
}
.gpt-markdown ul, .gpt-markdown ol {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
.gpt-markdown h1, .gpt-markdown h2, .gpt-markdown h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #fff;
}
.gpt-markdown h3 {
  font-size: 1.15em;
}
/* Ensure inner pre and code don't override our box styling */
.gpt-markdown pre {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}
.gpt-markdown code.hljs {
  background: transparent !important;
  padding: 0 !important;
}
.gpt-markdown *:not(pre) > code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.3rem;
  border-radius: 0.375rem;
  font-size: 0.85em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #ececf1;
}
.gpt-markdown *:not(pre) > code::before,
.gpt-markdown *:not(pre) > code::after {
  content: ""; 
}
</style>
