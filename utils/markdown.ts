import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

/** Render a fenced code block with a header bar and copy button. */
function buildCodeBlock(lang: string, highlightedCode: string, rawStr: string): string {
  const encodedStr = encodeURIComponent(rawStr)
  const copyScript = `
    const t = this.innerText;
    this.innerText = 'Copied!';
    navigator.clipboard.writeText(decodeURIComponent('${encodedStr}'));
    setTimeout(() => this.innerText = t, 2000);
  `.trim()

  const copyIcon = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
      stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  `.trim()

  return `
    <div class="rounded-lg mb-6 flex flex-col overflow-hidden bg-[#000000] border border-zinc-800">
      <div class="flex items-center justify-between px-4 py-2 bg-[#2f2f2f] text-xs font-sans text-zinc-300">
        <span class="text-zinc-400 font-semibold">${lang}</span>
        <button
          class="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          onclick="${copyScript}"
        >
          ${copyIcon}
          Copy code
        </button>
      </div>
      <div class="p-4 overflow-x-auto text-[14px] font-mono text-zinc-100 leading-relaxed custom-scrollbar">
        <pre><code class="hljs language-${lang}">${highlightedCode}</code></pre>
      </div>
    </div>
  `.trim()
}

/** markdown-it instance pre-configured with syntax highlighting. */
export const md = new MarkdownIt({
  breaks: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return buildCodeBlock(lang, highlighted, str)
      } catch {
        // fall through to plain block
      }
    }

    // Fallback: plain code block (no syntax highlighting)
    return buildCodeBlock('code', md.utils.escapeHtml(str), str)
  },
})
