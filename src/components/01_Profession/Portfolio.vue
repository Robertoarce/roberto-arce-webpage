<template>
  <div class="page-shell">
    <div class="page-header reveal">
      <p class="eyebrow">Portfolio</p>
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">
        Experiments and production work across machine learning, data engineering and applied AI.
      </p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading projects">
      <div v-for="n in 6" :key="n" class="card overflow-hidden">
        <div class="aspect-video animate-pulse bg-ink-700"></div>
        <div class="space-y-3 p-5">
          <div class="h-4 w-2/3 animate-pulse rounded bg-ink-700"></div>
          <div class="h-3 w-full animate-pulse rounded bg-ink-700"></div>
          <div class="h-3 w-4/5 animate-pulse rounded bg-ink-700"></div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(project, index) in projects"
        :key="project.title"
        class="card card-hover flex flex-col overflow-hidden reveal"
        :style="{ animationDelay: `${0.06 * index}s` }"
      >
        <!-- Screenshot -->
        <div class="relative aspect-video overflow-hidden border-b border-line bg-ink-900">
          <template v-for="({ path, url }, i) in imageModulesArray" :key="i">
            <img
              v-if="project.images && project.images.includes(path.split('/').pop())"
              :src="url"
              :alt="`${project.title} screenshot`"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
          </template>
          <div v-if="project.ongoing" class="absolute right-3 top-3">
            <span class="chip chip-accent">In progress</span>
          </div>
        </div>

        <!-- Body -->
        <div class="flex flex-1 flex-col p-5">
          <h2 class="font-display text-base font-semibold leading-snug text-paper sm:text-lg">
            {{ project.title }}
          </h2>

          <div
            class="prose-dark mt-3 line-clamp-6 text-[13px] sm:text-sm"
            v-html="project.description"
          ></div>

          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="tech in visibleTech(project.technologies)" :key="tech" class="chip text-[10px]">
              {{ tech }}
            </span>
            <span v-if="project.technologies && project.technologies.length > 6" class="chip text-[10px] text-faint">
              +{{ project.technologies.length - 6 }}
            </span>
          </div>

          <div class="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4 mt-5">
            <a
              v-if="project.git_link && project.git_link !== ''"
              :href="project.git_link"
              target="_blank"
              rel="noopener"
              class="btn-ghost btn-sm"
            >
              Repository
            </a>
            <a
              v-if="project.notebook_url && project.notebook_url !== ''"
              :href="project.notebook_url"
              target="_blank"
              rel="noopener"
              class="btn-primary btn-sm"
            >
              View notebook
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import fetchRepositoriesData from '/src/data/repositories.js';

const imageModules = import.meta.globEager('/src/assets/screenshots/*.*');

export default {
  name: 'Portfolio',
  data() {
    return {
      projects: [],
      loading: true,
    };
  },
  computed: {
    imageModulesArray() {
      return Object.entries(imageModules).map(([path, module]) => ({
        path,
        url: module.default,
      }));
    },
  },
  created() {
    fetchRepositoriesData()
      .then((projectsData) => {
        this.projects = projectsData;
      })
      .catch((error) => {
        console.error('Error fetching projects data:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    visibleTech(techs) {
      return Array.isArray(techs) ? techs.slice(0, 6) : [];
    },
  },
};
</script>
