<template>
  <div class="page-shell">
    <div class="page-header reveal">
      <p class="eyebrow">Credentials</p>
      <h1 class="page-title">Diplomas &amp; certificates</h1>
      <p class="page-subtitle">
        Academic background and certifications that shaped my path — from industrial engineering
        to machine learning and deep learning.
      </p>
    </div>

    <div class="mx-auto max-w-3xl reveal" style="animation-delay: 0.08s">
      <!-- Mode toggle -->
      <div class="mb-5 flex justify-center">
        <div class="inline-flex rounded-lg border border-line bg-ink-850 p-1" role="tablist" aria-label="Diplomas or certificates">
          <button
            type="button"
            role="tab"
            :aria-selected="ShowDiplomas"
            class="rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200"
            :class="ShowDiplomas ? 'bg-accent text-ink-950' : 'text-muted hover:text-paper'"
            @click="ShowDiplomas || ToggleDiplomas()"
          >
            Diplomas
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="!ShowDiplomas"
            class="rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200"
            :class="!ShowDiplomas ? 'bg-accent text-ink-950' : 'text-muted hover:text-paper'"
            @click="ShowDiplomas && ToggleDiplomas()"
          >
            Certificates
          </button>
        </div>
      </div>

      <!-- Viewer card -->
      <div class="card overflow-hidden">
        <div class="relative flex items-center justify-center bg-ink-900 p-4 sm:p-8">
          <img
            :src="items[currentIndex].image"
            :alt="items[currentIndex].title"
            class="max-h-[420px] w-auto max-w-full rounded-lg border border-line object-contain shadow-card"
          />
        </div>

        <div class="border-t border-line p-5 sm:p-7">
          <div class="flex items-center justify-between gap-3">
            <p class="font-mono text-xs text-faint">
              {{ currentIndex + 1 }} / {{ items.length }}
            </p>
            <div class="flex gap-1.5" aria-hidden="true">
              <span
                v-for="(item, i) in items"
                :key="i"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="i === currentIndex ? 'w-6 bg-accent' : 'w-1.5 bg-ink-600'"
              ></span>
            </div>
          </div>

          <h2 class="mt-4 font-display text-lg font-semibold text-paper sm:text-xl">
            {{ items[currentIndex].title }}
          </h2>
          <p class="prose-dark mt-3" v-html="formatNewlines(items[currentIndex].description)"></p>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-6 flex items-center justify-center gap-3">
        <button type="button" class="btn-ghost" @click="prevItem">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          Previous
        </button>
        <button type="button" class="btn-primary" @click="nextItem">
          Next
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import politecnico_milano from '@/politecnico_milano.jpg';
import upsa from '@/upsa.jpg';
import imm from '@/imm.jpg';
import msc_finance_eng from '@/msc_finance_eng.jpg';
import disney from '@/disney.jpg';
import ml from '@/ml.png';
import dl from '@/dl.png';

export default {
  name: 'Diplomas',
  data() {
    return {
      currentIndex: 0,
      ShowDiplomas: true,
      items: [],
      diplomas: [
        {
          image: politecnico_milano,
          title: 'Msc Supply Chain - Global Perspective Framework',
          description:
            'Supply Chain provided real-world context for data analysis, aiding in translating data insights into actionable strategies,\n and bridging the analytical and operational aspects of projects. \n This knowledge was significantly enriched with subsequent knowledge acquired in Data Science.',
        },
        {
          image: upsa,
          title: 'Bachelor Industrial Engineering - Solid thinking foundations',
          description:
            'The essence of engineering optimization, embodied in Industrial Engineering, \n acts as the cornerstone for my professional growth and innovation.',
        },
        {
          image: imm,
          title: 'Msc Management - Business understanding',
          description: 'A solid framework to thrive in the ever-evolving business landscape.',
        },
        {
          image: msc_finance_eng,
          title: 'Msc Finance - Quantitative financial management',
          description:
            'Deepen my understanding of financial dynamics and strategies \n in corporate finance, as well as in market finance.',
        },
      ],
      certificates: [
        {
          image: ml,
          title: 'Machine Learning Specialization - Andrew Ng - Stanford (renewed since first course in 2018)',
          description:
            'This course covers several machine learning techniques and applications, including <b>Supervised Learning</b> (like linear and logistic regression, neural networks, and decision trees) and <b>Unsupervised Learning</b> (such as clustering and anomaly detection), plus best practices for ML development. \n It also delves into advanced topics like building <b>recommender systems</b> through collaborative filtering and content-based methods, as well as <b>constructing deep reinforcement learning models</b>.',
        },
        {
          image: dl,
          title: 'Deep Learning Specialization - Andrew Ng - Stanford',
          description:
            'This course dives deep into the foundations and advanced techniques of deep learning, focusing on neural networks and their applications. <b>Neural Network Foundations</b> (including backpropagation, optimization techniques, and hyperparameter tuning), <b>Convolutional Networks</b> (used for image processing tasks), and <b>Recurrent Neural Networks</b> (RNNs) for sequence data. \n The specialization also explores advanced topics like <b>Generative Adversarial Networks</b> (GANs), <b>transformer architectures</b> for NLP, and tips for building production-ready deep learning systems.',
        },
        {
          image: disney,
          title: 'Internship - Disney Engineering',
          description:
            'This is a 6 month program at World Disney Orlando. Studying roller coasters engineering and premium customer service at Disney University.',
        },
      ],
    };
  },
  created() {
    this.items = this.ShowDiplomas ? this.diplomas : this.certificates;
  },
  methods: {
    nextItem() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    prevItem() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    },
    ToggleDiplomas() {
      this.ShowDiplomas = !this.ShowDiplomas;
      this.items = this.ShowDiplomas ? this.diplomas : this.certificates;
      this.currentIndex = 0;
    },
    formatNewlines(text) {
      return text.replace(/\n/g, '<br>');
    },
  },
};
</script>
