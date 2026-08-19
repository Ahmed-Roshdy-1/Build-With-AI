<!-- Three animated dots shown while the AI is generating a response. -->
<template>
  <div class="flex gap-4 w-full max-w-[85%] text-[15px] leading-7 items-center">
    <!-- AI avatar -->
    <div class="mt-0.5 shrink-0 grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-black">
      ✦
    </div>

    <!-- Bouncing dots -->
    <div class="flex gap-1">
      <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0s;"   />
      <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0.2s;" />
      <span class="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0.4s;" />
    </div>
  </div>
</template>
