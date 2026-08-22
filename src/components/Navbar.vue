<template>
  <header class="border-b border-line bg-ink-950/80 backdrop-blur-md">
    <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
      <!-- Brand -->
      <router-link to="/start" class="group flex items-center gap-2.5" aria-label="Roberto Arce — home">
        <img
          src="/src/assets/arce.png"
          class="h-8 w-8 rounded-lg border border-line bg-ink-800 object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
          alt="Roberto Arce monogram"
        />
        <span class="font-display text-lg font-semibold tracking-tight text-paper">
          Roberto<span class="text-accent"> Arce</span>
        </span>
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden items-center gap-1 lg:flex">
        <router-link :to="'/start'" class="nav-link" :class="{ 'nav-link-active': isActive('/start') }">Start</router-link>
        <router-link :to="'/timeline'" class="nav-link" :class="{ 'nav-link-active': isActive('/timeline') }">Timeline</router-link>
        <router-link :to="'/portfolio'" class="nav-link" :class="{ 'nav-link-active': isActive('/portfolio') }">Portfolio</router-link>
        <router-link :to="'/diplomas'" class="nav-link" :class="{ 'nav-link-active': isActive('/diplomas') }">Diplomas</router-link>
        <router-link :to="'/chatbot'" class="nav-link" :class="{ 'nav-link-active': isActive('/chatbot') }">Chatbot</router-link>

        <!-- Art dropdown -->
        <div class="relative">
          <button type="button" class="nav-drop-btn" :class="{ 'text-accent-soft': isActive('/art') }" @click="toggleMenu('art')" :aria-expanded="open === 'art'">
            Art
            <svg class="h-3.5 w-3.5 transition-transform duration-200" :class="{ 'rotate-180': open === 'art' }" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg>
          </button>
          <transition name="drop">
            <div v-if="open === 'art'" class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-line bg-ink-850 p-1.5 shadow-card">
              <router-link v-for="item in artLinks" :key="item.to" :to="item.to" class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-ink-800 hover:text-paper" @click="open = ''">
                <span class="font-mono text-[10px] uppercase tracking-wider text-accent/80">{{ item.tag }}</span>
                <span>{{ item.label }}</span>
              </router-link>
            </div>
          </transition>
        </div>

        <!-- Learning tools dropdown -->
        <div class="relative">
          <button type="button" class="nav-drop-btn" :class="{ 'text-accent-soft': isActive('/linear-regression') }" @click="toggleMenu('projects')" :aria-expanded="open === 'projects'">
            Learning tools
            <svg class="h-3.5 w-3.5 transition-transform duration-200" :class="{ 'rotate-180': open === 'projects' }" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1 4 4 4-4" /></svg>
          </button>
          <transition name="drop">
            <div v-if="open === 'projects'" class="absolute right-0 top-full mt-2 w-56 rounded-xl border border-line bg-ink-850 p-1.5 shadow-card">
              <router-link v-for="item in projectLinks" :key="item.to" :to="item.to" class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-ink-800 hover:text-paper" @click="open = ''">
                <span class="font-mono text-[10px] uppercase tracking-wider text-accent/80">{{ item.tag }}</span>
                <span>{{ item.label }}</span>
              </router-link>
            </div>
          </transition>
        </div>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-1.5">
        <a href="https://github.com/Robertoarce?tab=repositories" target="_blank" rel="noopener" class="btn-quiet !px-2.5" aria-label="GitHub">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" /></svg>
        </a>
        <a href="https://www.linkedin.com/in/robarce/?locale=en_US" target="_blank" rel="noopener" class="btn-quiet !px-2.5" aria-label="LinkedIn">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM7.119 20.452H3.555V9h3.564v11.452Z" /></svg>
        </a>

        <!-- Mobile hamburger -->
        <button type="button" class="btn-quiet !px-2.5 lg:hidden" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen" aria-label="Toggle menu">
          <svg v-if="!mobileOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <transition name="drop">
      <div v-if="mobileOpen" class="border-t border-line bg-ink-900/95 backdrop-blur-md lg:hidden">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          <router-link v-for="item in mainLinks" :key="item.to" :to="item.to" class="nav-link" :class="{ 'nav-link-active': isActive(item.to) }" @click="mobileOpen = false">{{ item.label }}</router-link>
          <div class="my-2 hairline"></div>
          <p class="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Art</p>
          <router-link v-for="item in artLinks" :key="item.to" :to="item.to" class="nav-link pl-5" @click="mobileOpen = false">{{ item.label }}</router-link>
          <div class="my-2 hairline"></div>
          <p class="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Learning tools</p>
          <router-link v-for="item in projectLinks" :key="item.to" :to="item.to" class="nav-link pl-5" @click="mobileOpen = false">{{ item.label }}</router-link>
        </div>
      </div>
    </transition>

    <!-- Click-away overlay for dropdowns -->
    <div v-if="open !== ''" class="fixed inset-0 z-[-1]" @click="open = ''" @keydown.esc="open = ''"></div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      open: '', // '' | 'art' | 'projects'
      mobileOpen: false,
      mainLinks: [
        { to: '/start', label: 'Start' },
        { to: '/timeline', label: 'Timeline' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/diplomas', label: 'Diplomas' },
        { to: '/chatbot', label: 'Chatbot' },
      ],
      artLinks: [
        { to: '/art/cube', label: '3D Cube', tag: '3D' },
        { to: '/art/galaxy', label: 'Galaxy', tag: 'Space' },
        { to: '/art/network', label: 'The Network', tag: 'Graph' },
        { to: '/art/coliders', label: 'Gravitas', tag: 'Field' },
      ],
      projectLinks: [
        { to: '/linear-regression', label: 'Linear Regression', tag: 'ML' },
        { to: '/linear-regression/dynamic-graphs', label: 'Dynamic Graphs', tag: 'Viz' },
      ],
    };
  },
  watch: {
    // Close menus on navigation
    $route() {
      this.open = '';
      this.mobileOpen = false;
    },
  },
  methods: {
    toggleMenu(name) {
      this.open = this.open === name ? '' : name;
    },
    isActive(path) {
      if (path === '/start') return this.$route.path === '/start';
      if (path === '/art') return this.$route.path.startsWith('/art/');
      if (path === '/linear-regression') return this.$route.path.startsWith('/linear-regression');
      return this.$route.path === path;
    },
  },
};
</script>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
