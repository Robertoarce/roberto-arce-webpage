<template>
  <div class="page-shell">
    <div class="grid items-start gap-10 lg:grid-cols-5 lg:gap-14">
      <!-- Identity panel -->
      <aside class="lg:sticky lg:top-24 lg:col-span-2">
        <div class="card p-6 sm:p-8 reveal">
          <div class="relative mx-auto w-40 sm:w-48">
            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent/30 to-transparent blur-lg" aria-hidden="true"></div>
            <img
              src="/src/assets/roberto.jpg"
              alt="Roberto Arce"
              class="relative aspect-square w-full rounded-2xl border border-line object-cover"
            />
          </div>

          <div class="mt-6 text-center">
            <h1 class="text-3xl font-semibold sm:text-4xl">Roberto Arce</h1>
            <p class="mt-2 font-mono text-sm text-accent-soft">Data Scientist · AI Engineer</p>
            <p class="mt-3 text-sm leading-relaxed text-muted">
              Statistical modeling, data mining and machine learning — building systems that turn
              raw data into decisions.
            </p>

            <div class="mt-4 flex items-center justify-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              <span class="text-xs text-muted">Currently based in Paris</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-2">
            <a class="btn-ghost" href="https://github.com/Robertoarce?tab=repositories" target="_blank" rel="noopener">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" /></svg>
              GitHub
            </a>
            <a class="btn-ghost" href="https://www.linkedin.com/in/robarce/?locale=en_US" target="_blank" rel="noopener">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM7.119 20.452H3.555V9h3.564v11.452Z" /></svg>
              LinkedIn
            </a>
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-1.5">
            <span v-for="tag in focusTags" :key="tag" class="chip">{{ tag }}</span>
          </div>
        </div>
      </aside>

      <!-- Latest projects -->
      <section class="lg:col-span-3">
        <div class="page-header reveal" style="animation-delay: 0.08s">
          <p class="eyebrow">Selected work</p>
          <h2 class="page-title">Latest projects</h2>
          <p class="page-subtitle">
            A selection of things I've built — machine learning pipelines, data experiments and
            interactive tools. Full list on <a class="link-accent" href="https://github.com/Robertoarce?tab=repositories" target="_blank" rel="noopener">GitHub</a>.
          </p>
        </div>

        <div v-if="loading" class="space-y-4" aria-label="Loading projects">
          <div v-for="n in 3" :key="n" class="card p-6">
            <div class="h-4 w-1/3 animate-pulse rounded bg-ink-700"></div>
            <div class="mt-3 h-3 w-full animate-pulse rounded bg-ink-700"></div>
            <div class="mt-2 h-3 w-5/6 animate-pulse rounded bg-ink-700"></div>
            <div class="mt-4 flex gap-2">
              <div class="h-6 w-16 animate-pulse rounded-md bg-ink-700"></div>
              <div class="h-6 w-16 animate-pulse rounded-md bg-ink-700"></div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-5">
          <article
            v-for="(repo, index) in visibleProjects"
            :key="repo.title"
            class="card card-hover p-6 sm:p-7 reveal"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <h3 class="font-display text-lg font-semibold text-paper sm:text-xl">{{ repo.title }}</h3>
              <span v-if="repo.ongoing" class="chip chip-accent">In progress</span>
            </div>

            <div class="prose-dark mt-3" v-html="repo.description"></div>

            <div class="mt-5 flex flex-wrap gap-1.5">
              <span v-for="tech in repo.technologies" :key="tech" class="chip">{{ tech }}</span>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
              <a
                v-if="repo.git_link"
                :href="repo.git_link"
                target="_blank"
                rel="noopener"
                class="btn-ghost btn-sm"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" /></svg>
                Repository
              </a>
              <a
                v-if="repo.notebook_url"
                :href="repo.notebook_url"
                target="_blank"
                rel="noopener"
                class="btn-primary btn-sm"
              >
                View notebook
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import fetchRepositoriesData from '/src/data/repositories.js';

export default {
  name: 'StartPage',
  data() {
    return {
      repositories: [],
      loading: true,
      focusTags: ['Python', 'ML Pipelines', 'Data Mining', 'AI'],
    };
  },
  computed: {
    visibleProjects() {
      return this.repositories.filter((repo) => repo.in_startpage);
    },
  },
  created() {
    fetchRepositoriesData()
      .then((data) => {
        this.repositories = data;
      })
      .catch((error) => {
        console.error('Error fetching repositories data:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
