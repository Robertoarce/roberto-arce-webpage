<template>
  <div class="flex min-h-[100dvh] flex-col bg-ink-950 text-paper">
    <Navbar class="sticky top-0 z-50" />
    <main class="flex-1">
      <router-view />
    </main>
    <footer class="hairline border-t border-line">
      <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p class="font-mono text-xs text-faint">
          © {{ year }} Roberto Arce — Data Scientist &amp; ML Engineer
        </p>
        <div class="flex items-center gap-4">
          <a class="link-accent text-xs" href="https://github.com/Robertoarce?tab=repositories" target="_blank" rel="noopener">GitHub</a>
          <span class="h-3 w-px bg-line"></span>
          <a class="link-accent text-xs" href="https://www.linkedin.com/in/robarce/?locale=en_US" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';

export default {
  name: 'Layout',
  components: { Navbar },
  data() {
    return { year: new Date().getFullYear() };
  },
};
</script>
