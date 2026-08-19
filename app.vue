<template>
  <NuxtPage />
</template>

<style>
/* Global scrollbar styling to match sleek UI */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  border: 4px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
::-webkit-scrollbar-corner {
  background: transparent;
}

body {
  background-color: #212121;
}
</style>