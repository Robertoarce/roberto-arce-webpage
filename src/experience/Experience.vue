<template>
  <div class="experience" ref="rootEl">
    <!-- top scroll-progress hairline -->
    <div class="scroll-progress" ref="progressEl" aria-hidden="true"></div>

    <!-- subtle "VIEW PROJECT" cursor indicator (desktop only) -->
    <div class="cursor-indicator" ref="cursorEl" aria-hidden="true">
      <span class="cursor-label">View project</span>
    </div>

    <!-- ================= Navigation ================= -->
    <header class="exp-nav" :class="{ 'is-scrolled': scrolled }">
      <a href="#hero" class="brand" @click.prevent="scrollTo('hero')">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name">Roberto&nbsp;<em>Arce</em></span>
      </a>

      <nav class="nav-links" aria-label="Primary">
        <a
          v-for="l in navLinks"
          :key="l.id"
          :href="`#${l.id}`"
          :class="{ 'is-active': activeSection === l.id }"
          @click.prevent="scrollTo(l.id)"
        >{{ l.label }}</a>
      </nav>

      <button
        class="menu-btn"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
      </button>
    </header>

    <!-- Mobile menu -->
    <transition name="menu">
      <div v-if="menuOpen" class="mobile-menu">
        <a
          v-for="(l, i) in navLinks"
          :key="l.id"
          :href="`#${l.id}`"
          :style="{ transitionDelay: `${i * 40}ms` }"
          @click.prevent="scrollTo(l.id)"
        >
          <span class="mm-index">0{{ i + 1 }}</span>
          {{ l.label }}
        </a>
      </div>
    </transition>

    <!-- ================= Hero ================= -->
    <section id="hero" ref="heroEl" class="hero">
      <div class="hero-art" ref="artWrap">
        <ParisArt ref="artEl" />
      </div>

      <div class="hero-type" ref="heroType">
        <p class="hero-kicker hero-anim">Data Scientist · Machine Learning Engineer</p>
        <h1 class="hero-title hero-anim">
          <span class="line">ROBERTO</span>
          <span class="line">ARCE<em class="serif">.</em></span>
        </h1>
        <p class="hero-sub hero-anim">Mosaic pieces become data, and data becomes ideas.</p>
      </div>

      <span class="hero-kanji" aria-hidden="true">巴黎</span>

      <div class="hero-foot hero-anim" aria-hidden="true">
        <span class="hf">Paris · 48.8566° N 2.3522° E</span>
        <span class="hf hf-scroll">Scroll to enter ↓</span>
        <span class="hf">RA — 01</span>
      </div>
    </section>

    <!-- ================= Story / transition ================= -->
    <section id="story" class="story">
      <p class="eyebrow-print" data-reveal>02 — Transition</p>
      <h2 class="story-title" data-reveal>
        A mosaic is many <em class="serif">pieces</em>.<br />
        Data is many pieces.<br />
        Ideas are the <span class="accent">whole</span>.
      </h2>
      <div class="story-tiles" aria-hidden="true">
        <span v-for="n in 44" :key="n" class="st"></span>
      </div>
    </section>

    <!-- ================= Work / projects ================= -->
    <section id="work" ref="workEl" class="work">
      <div class="work-head">
        <p class="eyebrow-print" data-reveal>01 — Selected Work</p>
        <h2 class="work-title" data-reveal>Projects, as <em class="serif">tiles</em>.</h2>
      </div>

      <div v-if="!projectsLoaded" class="work-skeleton" aria-label="Loading projects">
        <div v-for="n in 6" :key="n" class="skel" :class="`skel-${n}`"></div>
      </div>

      <div v-else class="mosaic-grid">
        <article
          v-for="(p, i) in projects"
          :key="p.id"
          class="tile"
          :class="spanFor(i)"
          tabindex="0"
          role="button"
          :aria-label="`Open project: ${p.title}`"
          @mouseenter="onTileEnter"
          @mouseleave="onTileLeave"
          @click="openProject(p)"
          @keydown.enter="openProject(p)"
        >
          <img v-if="p.image" class="tile-img" :src="p.image" :alt="''" loading="lazy" />
          <div class="tile-overlay" aria-hidden="true"></div>
          <div class="tile-content">
            <div class="tile-top">
              <span class="tile-num">{{ p.number }}</span>
              <span class="tile-cat">{{ p.category }}</span>
            </div>
            <h3 class="tile-title">{{ p.title }}</h3>
            <p class="tile-summary">{{ p.summary }}</p>
            <div class="tile-foot">
              <div class="tile-tech">
                <span v-for="t in p.technologies.slice(0, 3)" :key="t" class="ttech">{{ t }}</span>
              </div>
              <span class="tile-view">View <span aria-hidden="true">↗</span></span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ================= About ================= -->
    <section id="about" class="about">
      <div class="about-tiles" aria-hidden="true">
        <span v-for="n in 28" :key="n" class="at"></span>
      </div>

      <p class="eyebrow-print" data-reveal>03 — About</p>
      <h2 class="about-title" data-reveal>Roberto&nbsp;<em class="serif">Arce</em></h2>
      <p class="about-lede" data-reveal>
        Statistical modeling, data mining and machine learning — building systems that turn raw
        data into decisions.
      </p>
      <p class="about-body" data-reveal>
        Based in Paris. Working at the intersection of data, machine learning and thoughtful
        products. <em class="placeholder">[Replace with your own bio.]</em>
      </p>

      <div class="about-meta" data-reveal>
        <div class="am"><span class="am-k">Focus</span><span class="am-v">Data Science · ML Engineering</span></div>
        <div class="am"><span class="am-k">Based</span><span class="am-v">Paris, France</span></div>
        <div class="am"><span class="am-k">Currently</span><span class="am-v placeholder">[placeholder]</span></div>
      </div>
    </section>

    <!-- ================= Research ================= -->
    <section id="research" class="research">
      <p class="eyebrow-print" data-reveal>04 — Research</p>
      <h2 class="research-title" data-reveal>Notes &amp; <em class="serif">experiments</em>.</h2>
      <p class="research-body" data-reveal>
        A space for explorations in data and machine learning.
        <em class="placeholder">[Replace with your own research notes.]</em>
      </p>

      <div class="research-viz" ref="researchViz" aria-hidden="true">
        <svg viewBox="0 0 900 240" preserveAspectRatio="none" class="rviz-svg">
          <g class="rviz-grid">
            <path d="M0 40 H900 M0 90 H900 M0 140 H900 M0 190 H900" />
            <path d="M150 0 V240 M300 0 V240 M450 0 V240 M600 0 V240 M750 0 V240" />
          </g>
          <polyline
            class="rviz-line"
            points="20,190 130,150 220,168 330,110 450,128 560,74 680,96 880,40"
          />
          <g class="rviz-dots">
            <circle cx="130" cy="150" r="5" />
            <circle cx="330" cy="110" r="5" />
            <circle cx="560" cy="74" r="5" />
            <circle cx="880" cy="40" r="5" />
          </g>
        </svg>
        <span class="rviz-label">fig. 01 — signal / noise</span>
      </div>
    </section>

    <!-- ================= Contact ================= -->
    <footer id="contact" class="contact">
      <p class="eyebrow-print" data-reveal>05 — Contact</p>
      <h2 class="contact-title" data-reveal>Let's make something <em class="serif">whole</em>.</h2>

      <div class="contact-links" data-reveal>
        <a class="cta" href="https://github.com/Robertoarce?tab=repositories" target="_blank" rel="noopener">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a class="cta" href="https://www.linkedin.com/in/robarce/?locale=en_US" target="_blank" rel="noopener">
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <span class="cta cta-email placeholder">Email — add your address in <code>Experience.vue</code></span>
      </div>

      <div class="contact-foot" data-reveal>
        <span>© {{ year }} Roberto Arce</span>
        <span class="contact-note">Mosaic → Data → Ideas</span>
      </div>
    </footer>

    <ProjectModal :project="activeProject" @close="closeProject" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParisArt from './ParisArt.vue';
import ProjectModal from './ProjectModal.vue';
import loadProjects from './projects.js';

gsap.registerPlugin(ScrollTrigger);

// Asymmetric mosaic spans (12-col desktop grid). Tailwind scans these literals.
const SPANS = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-7',
  'md:col-span-4',
  'md:col-span-4',
  'md:col-span-4',
  'md:col-span-6',
  'md:col-span-6',
];

export default {
  name: 'Experience',
  components: { ParisArt, ProjectModal },
  data() {
    return {
      projects: [],
      projectsLoaded: false,
      activeProject: null,
      menuOpen: false,
      scrolled: false,
      activeSection: 'work',
      reduceMotion: false,
      isFinePointer: false,
      navLinks: [
        { id: 'work', label: 'Work' },
        { id: 'about', label: 'About' },
        { id: 'research', label: 'Research' },
        { id: 'contact', label: 'Contact' },
      ],
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  mounted() {
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // gsap.context scopes every tween/ScrollTrigger so we can revert cleanly.
    this.ctx = gsap.context(() => {});
    if (!this.reduceMotion) {
      this.ctx.add(() => {
        this.initHeroIntro();
        this.initPointer();
        this.initCloudDrift();
        this.initScrollStory();
        this.initReveals();
        this.initResearchViz();
        this.initProgress();
        this.initScrollSpy();
        this.initNavState();
      });
    }

    this.loadProjects();
  },
  beforeUnmount() {
    if (this._onPointerMove) window.removeEventListener('mousemove', this._onPointerMove);
    if (this.ctx) this.ctx.revert();
  },
  methods: {
    /* ---------------- data ---------------- */
    async loadProjects() {
      try {
        const projects = await loadProjects();
        this.projects = projects;
        this.projectsLoaded = true;
        await this.$nextTick();
        if (!this.reduceMotion && this.ctx) {
          this.ctx.add(() => this.initProjects());
        }
        ScrollTrigger.refresh();
      } catch (err) {
        console.error('Failed to load projects:', err);
        this.projectsLoaded = true;
      }
    },

    /* ---------------- hero entrance ---------------- */
    initHeroIntro() {
      const art = this.$refs.artEl && this.$refs.artEl.$el;
      if (!art) return;
      const L = (n) => art.querySelector(`[data-layer="${n}"]`);

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(L('sky'), { opacity: 0, duration: 1 }, 0)
        .from(L('mosaic'), { opacity: 0, scale: 1.08, duration: 1.1 }, 0.05)
        .from(L('cloud-left'), { x: -80, opacity: 0, duration: 1.5 }, 0.1)
        .from(L('cloud-right'), { x: 80, opacity: 0, duration: 1.5 }, 0.1)
        .from(L('sun'), { scale: 0.7, opacity: 0, duration: 1.5 }, '-=1')
        .from(this.$el.querySelectorAll('.hero-anim'), { y: 44, opacity: 0, duration: 1, stagger: 0.09, ease: 'power4.out' }, 0.22);
    },

    /* ---------------- continuous cloud drift ---------------- */
    initCloudDrift() {
      const art = this.$refs.artEl && this.$refs.artEl.$el;
      if (!art) return;
      const L = (n) => art.querySelector(`[data-layer="${n}"]`);

      gsap.to(L('cloud-left'), {
        x: 80, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.2,
      });
      gsap.to(L('cloud-right'), {
        x: -100, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.2,
      });
    },

    /* ---------------- pointer (parallax + cursor) ---------------- */
    initPointer() {
      if (!this.isFinePointer) return;
      const artWrap = this.$refs.artWrap;
      const cursor = this.$refs.cursorEl;

      const qxWrap = gsap.quickTo(artWrap, 'x', { duration: 0.6, ease: 'power3.out' });
      const qyWrap = gsap.quickTo(artWrap, 'y', { duration: 0.6, ease: 'power3.out' });
      const qx = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3.out' });
      const qy = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3.out' });

      this._onPointerMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        qxWrap(nx * 14);
        qyWrap(ny * 10);
        qx(e.clientX);
        qy(e.clientY);
      };
      window.addEventListener('mousemove', this._onPointerMove, { passive: true });
    },

    /* ---------------- scroll story (the core) ---------------- */
    initScrollStory() {
      const hero = this.$refs.heroEl;
      const art = this.$refs.artEl && this.$refs.artEl.$el;
      if (!hero || !art) return;
      const L = (n) => art.querySelector(`[data-layer="${n}"]`);
      const R = (id) => art.querySelector(`#${id}`);
      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: isMobile ? '+=170%' : '+=340%',
          scrub: 1,
          pin: isMobile ? false : hero,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — the sun drifts; the typography hands the scene over.
      tl.to(L('sun'), { xPercent: -8, yPercent: 8, scale: 1.08, duration: 1 }, 0)
        .to(this.$refs.heroType, { y: -120, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
        .to(this.$el.querySelectorAll('.hero-kanji, .hero-foot'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);

      // Gentle parallax across the whole story (parallel with everything).
      tl.to(L('eiffel'), { yPercent: -8, duration: 10.2 }, 0)
        .to(L('city'), { yPercent: -4, duration: 10.2 }, 0);

      // Phase 2 — Paris rises from the bottom: skyline, then the Tower.
      tl.to(R('pc-city-rect'), { attr: { y: 0.45 }, duration: 1.2 }, 0.6)
        .to(R('pc-eiffel-rect'), { attr: { y: 0.25 }, duration: 1 }, 1.6);

      // Phase 3 — the whole city, then the Seine and the bridge.
      tl.to(R('pc-city-rect'), { attr: { y: 0 }, duration: 1.2 }, 2.6)
        .to(R('pc-eiffel-rect'), { attr: { y: 0 }, duration: 0.8 }, 2.6)
        .to(R('pc-river-rect'), { attr: { y: 0 }, duration: 1 }, 3.8)
        .to(R('pc-bridge-rect'), { attr: { y: 0 }, duration: 1 }, 3.8);

      // Phase 4 — the boat crosses the Seine. The bridge is painted above the
      // boat, so it naturally hides the boat while it passes underneath.
      tl.to(L('boat'), { x: 547, duration: 1.4, ease: 'power1.inOut' }, 4.8)
        .to(L('boat'), { x: 893, duration: 1.2, ease: 'power1.inOut' }, 6.2)
        .to(L('boat'), { x: 1656, duration: 1.8, ease: 'power1.in' }, 7.4);

      // Final reveal — the flowers close the frame.
      tl.to(R('pc-foreground-rect'), { attr: { y: 0 }, duration: 1 }, 9.2);
    },

    /* ---------------- generic section reveals ---------------- */
    initReveals() {
      const reveals = gsap.utils.toArray(this.$el.querySelectorAll('[data-reveal]'));
      reveals.forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // story + about mosaic strips assemble (desktop only — hidden on mobile)
      if (window.matchMedia('(min-width: 768px)').matches) {
        const strip = (sel) => {
          const triggerEl = this.$el.querySelector(sel.split(' ')[0]);
          if (!triggerEl) return;
          gsap.from(this.$el.querySelectorAll(sel), {
            x: () => gsap.utils.random(-160, 160),
            y: () => gsap.utils.random(-120, 120),
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: { each: 0.02, from: 'random' },
            ease: 'power3.out',
            scrollTrigger: { trigger: triggerEl, start: 'top 72%', once: true },
          });
        };

        strip('.story-tiles span');
        strip('.about-tiles span');
      }
    },

    /* ---------------- projects assemble ---------------- */
    initProjects() {
      const tiles = this.$el.querySelectorAll('.tile');
      gsap.from(tiles, {
        y: 60,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power4.out',
        scrollTrigger: { trigger: this.$refs.workEl, start: 'top 78%', once: true },
      });
    },

    /* ---------------- research line draw ---------------- */
    initResearchViz() {
      const line = this.$el.querySelector('.rviz-line');
      const dots = this.$el.querySelectorAll('.rviz-dots circle');
      if (line) {
        gsap.fromTo(
          line,
          { strokeDasharray: 1600, strokeDashoffset: 1600 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: this.$refs.researchViz || line, start: 'top 80%', once: true },
          }
        );
      }
      if (dots.length) {
        gsap.from(dots, {
          scale: 0,
          transformOrigin: 'center',
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: this.$refs.researchViz || line, start: 'top 80%', once: true },
        });
      }
    },

    /* ---------------- progress + nav state ---------------- */
    initProgress() {
      gsap.to(this.$refs.progressEl, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: this.$refs.rootEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    },

    initScrollSpy() {
      const sections = this.navLinks.map((l) => l.id);
      sections.forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) this.activeSection = id;
          },
        });
      });
    },

    initNavState() {
      ScrollTrigger.create({
        start: 40,
        end: 'max',
        onToggle: (self) => {
          this.scrolled = self.isActive;
        },
      });
    },

    /* ---------------- interactions ---------------- */
    onTileEnter() {
      if (!this.isFinePointer || !this.$refs.cursorEl) return;
      gsap.to(this.$refs.cursorEl, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    },
    onTileLeave() {
      if (!this.$refs.cursorEl) return;
      gsap.to(this.$refs.cursorEl, { opacity: 0, scale: 0.85, duration: 0.25, overwrite: 'auto' });
    },
    openProject(p) {
      this.activeProject = p;
    },
    closeProject() {
      this.activeProject = null;
    },
    scrollTo(id) {
      this.menuOpen = false;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: this.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    },
    spanFor(i) {
      return SPANS[i % SPANS.length];
    },
  },
};
</script>

<style scoped>
.experience {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background: #f4efe5;
  color: #0e2033;
  overflow-x: clip;
}

/* ---------- shared editorial accents ---------- */
.serif {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
}
.eyebrow-print {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #c43d2c;
}
.placeholder {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.82em;
  color: #5b7a99;
}

/* ---------- scroll progress ---------- */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 60;
  background: #c43d2c;
  transform: scaleX(0);
  transform-origin: left;
}

/* ---------- cursor ---------- */
.cursor-indicator {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  pointer-events: none;
  opacity: 0;
}
.cursor-label {
  display: inline-block;
  margin-left: 16px;
  margin-top: -34px;
  padding: 0.35rem 0.65rem;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fbf8f2;
  background: #c43d2c;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---------- nav ---------- */
.exp-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(1.25rem, 4vw, 3.5rem);
  transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}
.exp-nav.is-scrolled {
  background: rgba(244, 239, 229, 0.82);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(10, 22, 34, 0.06);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: #0e2033;
}
.brand-mark {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background:
    linear-gradient(135deg, #c43d2c 0 50%, #0d1c2e 50% 100%);
  box-shadow: 0 0 0 1px rgba(10, 22, 34, 0.08);
}
.brand-name {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.brand-name em {
  font-style: normal;
  color: #c43d2c;
}
.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
}
.nav-links a {
  position: relative;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0e2033;
  opacity: 0.72;
  transition: opacity 0.2s ease;
}
.nav-links a:hover,
.nav-links a.is-active {
  opacity: 1;
}
.nav-links a.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 1px;
  background: #c43d2c;
}
.menu-btn {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-btn span {
  display: block;
  width: 26px;
  height: 1.6px;
  background: #0e2033;
  transition: transform 0.3s ease;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 49;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 6rem clamp(1.5rem, 6vw, 4rem);
  background: #f4efe5;
}
.mobile-menu a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(2rem, 9vw, 3.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0e2033;
  border-bottom: 1px solid #c8bb9f;
  padding: 0.5rem 0;
}
.mobile-menu .mm-index {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.8rem;
  color: #c43d2c;
}
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

/* ---------- hero ---------- */
.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
  scroll-margin-top: 0;
}
.hero-art {
  position: absolute;
  inset: -2rem;
}
.hero-type {
  position: absolute;
  left: clamp(1.25rem, 5vw, 5rem);
  bottom: clamp(6.5rem, 18vh, 10rem);
  z-index: 2;
  max-width: 92vw;
}
.hero-kicker {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.74rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5b7a99;
  margin-bottom: 1.25rem;
}
.hero-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(3.4rem, 13vw, 11rem);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: #0d1c2e;
  text-shadow: 0 2px 30px rgba(244, 239, 229, 0.5);
}
.hero-title .line {
  display: block;
}
.hero-title em {
  font-style: normal;
  font-family: 'Instrument Serif', Georgia, serif;
  color: #c43d2c;
}
.hero-sub {
  margin-top: 1.4rem;
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
  color: #3a4653;
  max-width: 34ch;
}
.hero-kanji {
  position: absolute;
  right: clamp(1.25rem, 4vw, 3.5rem);
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-size: clamp(1.6rem, 4vw, 3rem);
  letter-spacing: 0.4em;
  color: rgba(13, 28, 46, 0.16);
}
.hero-foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1.25rem, 5vw, 5rem);
  border-top: 1px solid rgba(13, 28, 46, 0.12);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e2033;
}
.hf-scroll {
  color: #c43d2c;
}

/* ---------- story ---------- */
.story {
  position: relative;
  padding: clamp(6rem, 16vh, 11rem) clamp(1.25rem, 5vw, 5rem);
  scroll-margin-top: 4rem;
  overflow: hidden;
}
.story-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(1.9rem, 5.5vw, 4.4rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #0d1c2e;
  max-width: 24ch;
  margin-top: 1.25rem;
}
.story-title .accent {
  color: #c43d2c;
}
.story-tiles {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(6, 22px);
  gap: 6px;
  opacity: 0.5;
}
.st {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: #0d1c2e;
}
.st:nth-child(3n) { background: #c43d2c; }
.st:nth-child(5n) { background: #5b7a99; }

/* ---------- work ---------- */
.work {
  padding: clamp(4rem, 10vh, 7rem) clamp(1.25rem, 4vw, 4rem);
  scroll-margin-top: 4rem;
}
.work-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(2rem, 5vh, 3.5rem);
}
.work-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #0d1c2e;
}

.work-skeleton {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.25rem;
}
.skel {
  border-radius: 1rem;
  border: 1px solid #c8bb9f;
  background: #efe7d5;
  min-height: 240px;
  animation: skel-pulse 1.4s ease-in-out infinite;
}
.skel-1 { grid-column: span 7; grid-row: span 2; }
.skel-2 { grid-column: span 5; }
.skel-3 { grid-column: span 5; }
.skel-4 { grid-column: span 7; }
.skel-5 { grid-column: span 4; }
.skel-6 { grid-column: span 4; }
@keyframes skel-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

.mosaic-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(240px, auto);
  gap: 1.25rem;
}

/* tile */
.tile {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid #c8bb9f;
  background: #f7f1e6;
  padding: 1.5rem;
  min-height: 240px;
  cursor: pointer;
  display: flex;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease, box-shadow 0.45s ease;
}
.tile:hover,
.tile:focus-visible {
  transform: translateY(-4px) scale(1.008);
  border-color: #c43d2c;
  box-shadow: 0 26px 60px -32px rgba(10, 22, 34, 0.45);
  outline: none;
}
.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(13, 28, 46, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 28, 46, 0.05) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.5;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.tile:hover::before {
  opacity: 1;
}
.tile-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.13;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.tile:hover .tile-img {
  transform: scale(1.06);
  opacity: 0.2;
}
.tile-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(247, 241, 230, 0.94), rgba(247, 241, 230, 0.6));
  pointer-events: none;
}
.tile-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.tile-num { color: #c43d2c; }
.tile-cat { color: #5b7a99; }
.tile-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #0d1c2e;
  margin-top: 1.4rem;
}
.tile-summary {
  margin-top: 0.85rem;
  font-size: 0.92rem;
  line-height: 1.55;
  color: #55606d;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tile-foot {
  margin-top: auto;
  padding-top: 1.4rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}
.tile-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.ttech {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.02em;
  color: #0e2033;
  border: 1px solid #c8bb9f;
  border-radius: 0.35rem;
  padding: 0.22rem 0.45rem;
  background: rgba(244, 239, 229, 0.6);
}
.tile-view {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c43d2c;
  white-space: nowrap;
}

/* ---------- about ---------- */
.about {
  position: relative;
  padding: clamp(5rem, 14vh, 9rem) clamp(1.25rem, 5vw, 5rem);
  scroll-margin-top: 4rem;
}
.about-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: #0d1c2e;
  margin-top: 1rem;
}
.about-title em {
  font-style: normal;
  font-family: 'Instrument Serif', Georgia, serif;
  color: #c43d2c;
}
.about-lede {
  margin-top: 2.25rem;
  font-size: clamp(1.15rem, 2.4vw, 1.5rem);
  line-height: 1.4;
  color: #0e2033;
  max-width: 46ch;
}
.about-body {
  margin-top: 1rem;
  color: #55606d;
  max-width: 60ch;
}
.about-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-top: 2.5rem;
  border-top: 1px solid rgba(13, 28, 46, 0.12);
}
.am {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(13, 28, 46, 0.12);
}
.am-k {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #77808c;
}
.am-v { color: #0e2033; }
.about-tiles {
  position: absolute;
  right: clamp(1.25rem, 6vw, 8rem);
  top: clamp(4rem, 12vh, 8rem);
  display: grid;
  grid-template-columns: repeat(4, 20px);
  gap: 5px;
  opacity: 0.55;
}
.at {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #0d1c2e;
}
.at:nth-child(4n) { background: #c43d2c; }
.at:nth-child(7n) { background: #5b7a99; }

/* ---------- research ---------- */
.research {
  padding: clamp(4rem, 12vh, 8rem) clamp(1.25rem, 5vw, 5rem);
  scroll-margin-top: 4rem;
  background: #efe7d5;
}
.research-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #0d1c2e;
  margin-top: 1rem;
}
.research-body {
  margin-top: 1rem;
  color: #55606d;
  max-width: 56ch;
}
.research-viz {
  margin-top: 2.5rem;
  border: 1px solid #c8bb9f;
  border-radius: 1rem;
  background: #f4efe5;
  padding: 1rem 1rem 0.5rem;
}
.rviz-svg {
  width: 100%;
  height: 200px;
  display: block;
}
.rviz-grid path {
  fill: none;
  stroke: #0d1c2e;
  stroke-opacity: 0.08;
  stroke-width: 1;
}
.rviz-line {
  fill: none;
  stroke: #c43d2c;
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.rviz-dots circle {
  fill: #0d1c2e;
}
.rviz-label {
  display: block;
  margin-top: 0.5rem;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #77808c;
}

/* ---------- contact ---------- */
.contact {
  padding: clamp(5rem, 16vh, 10rem) clamp(1.25rem, 5vw, 5rem) 3rem;
  scroll-margin-top: 4rem;
}
.contact-title {
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(2.4rem, 7vw, 5.5rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #0d1c2e;
  margin-top: 1rem;
  max-width: 18ch;
}
.contact-title em {
  font-style: normal;
  font-family: 'Instrument Serif', Georgia, serif;
  color: #c43d2c;
}
.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
}
.cta {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0e2033;
  border: 1px solid #c8bb9f;
  border-radius: 0.6rem;
  padding: 0.8rem 1.2rem;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.cta:hover {
  background: #c43d2c;
  border-color: #c43d2c;
  color: #fbf8f2;
  transform: translateY(-2px);
}
.cta-email {
  color: #5b7a99;
  border-style: dashed;
}
.cta-email:hover {
  background: none;
  color: #5b7a99;
  border-color: #5b7a99;
  transform: none;
  cursor: default;
}
.contact-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 4rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(13, 28, 46, 0.12);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #77808c;
}
.contact-note { color: #c43d2c; }

/* ---------- responsive ---------- */
@media (min-width: 768px) {
  .nav-links { display: flex; }
  .menu-btn { display: none; }
  .mosaic-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .about-meta {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .am { grid-template-columns: 1fr; gap: 0.25rem; }
}
@media (max-width: 767px) {
  .story-tiles { display: none; }
  .about-tiles { display: none; }
  .hero-kanji { display: none; }
  .tile-summary { -webkit-line-clamp: 2; }
}
</style>
