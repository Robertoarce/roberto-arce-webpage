<template>
  <div class="page-shell">
    <div class="page-header reveal">
      <p class="eyebrow">Career</p>
      <h1 class="page-title">Timeline</h1>
      <p class="page-subtitle">
        From industrial engineering in Bolivia to data science in Paris — a career built on
        optimization, curiosity and shipping.
      </p>
    </div>

    <div class="relative">
      <!-- Spine -->
      <div
        class="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent/0 via-line to-accent/0 md:left-1/2 md:-translate-x-px"
        aria-hidden="true"
      ></div>

      <div
        v-for="(work, index) in works"
        :key="index"
        class="relative mb-6 pl-12 md:w-1/2 md:pl-0 sm:mb-8"
        :class="index % 2 === 0 ? 'md:pr-14' : 'md:ml-auto md:pl-14'"
      >
        <!-- Dot -->
        <span
          class="absolute left-4 top-7 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center md:left-1/2"
          aria-hidden="true"
        >
          <span class="absolute h-3.5 w-3.5 rounded-full bg-accent/25"></span>
          <span class="relative h-2 w-2 rounded-full bg-accent"></span>
        </span>

        <!-- Card -->
        <article class="card card-hover p-5 sm:p-6 reveal" :style="{ animationDelay: `${0.05 * index}s` }">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span
              class="chip"
              :class="work.entrepreneurship ? 'chip-accent' : work.study ? 'chip' : 'chip'"
            >
              {{ work.entrepreneurship ? 'Entrepreneur' : work.study ? 'Education' : 'Work' }}
            </span>
            <p class="font-mono text-[11px] text-faint">
              {{ work.date }}<span v-if="work.duration"> · {{ work.duration }}</span>
            </p>
          </div>

          <h2 class="mt-3 font-display text-lg font-semibold leading-snug text-paper sm:text-xl">
            {{ work.title }}
          </h2>

          <p class="mt-1 text-sm">
            <span class="font-medium text-accent-soft">{{ work.company }}</span>
            <span class="text-faint"> — {{ work.city }}, {{ work.country }}</span>
          </p>

          <div class="prose-dark mt-3 text-[13px] sm:text-sm" v-html="formatText(work.description)"></div>

          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="(skill, skillIndex) in work.utils" :key="skillIndex" class="chip text-[10px]">
              {{ skill }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { works } from '/src/data/cv.js';
export default {
  name: 'TimeLine',
  data() {
    return {
      works,
    };
  },
  methods: {
    formatText(text) {
      let formattedText = text.replace(/<</g, '<b>');
      formattedText = formattedText.replace(/>>/g, '</b>');
      formattedText = formattedText.replace(/\n/g, '<br>');
      return formattedText;
    },
  },
};
</script>
