<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="project"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="close"
      >
        <div class="modal-panel" role="document">
          <button class="modal-close" type="button" @click="close" aria-label="Close project">
            <span aria-hidden="true">✕</span>
          </button>

          <div class="modal-scroll">
            <div class="modal-head">
              <span class="modal-num">{{ project.number }}</span>
              <span class="modal-cat">{{ project.category }}</span>
              <span v-if="project.ongoing" class="modal-ongoing">In progress</span>
            </div>

            <h2 :id="titleId" class="modal-title">{{ project.title }}</h2>

            <div v-if="project.image" class="modal-media">
              <img :src="project.image" :alt="`${project.title} — preview`" />
            </div>

            <dl class="modal-meta">
              <div class="mm-row">
                <dt>Role</dt>
                <dd>{{ project.role }}</dd>
              </div>
              <div class="mm-row">
                <dt>Category</dt>
                <dd>{{ project.category }}</dd>
              </div>
            </dl>

            <p class="modal-desc">{{ project.description }}</p>

            <div class="modal-tech">
              <span v-for="t in project.technologies" :key="t" class="mtech">{{ t }}</span>
            </div>

            <div class="modal-actions">
              <a
                v-if="project.git_link"
                class="ma-primary"
                :href="project.git_link"
                target="_blank"
                rel="noopener"
              >
                View repository <span aria-hidden="true">↗</span>
              </a>
              <a
                v-if="project.notebook_url"
                class="ma-ghost"
                :href="project.notebook_url"
                target="_blank"
                rel="noopener"
              >
                Open notebook <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'ProjectModal',
  props: {
    project: { type: Object, default: null },
  },
  emits: ['close'],
  computed: {
    titleId() {
      return `project-${this.project ? this.project.id : 'none'}`;
    },
  },
  watch: {
    project(val) {
      document.documentElement.classList.toggle('is-modal-open', !!val);
      if (val) {
        this.$nextTick(() => {
          const closeBtn = document.querySelector('.modal-close');
          if (closeBtn) closeBtn.focus();
        });
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
    document.documentElement.classList.remove('is-modal-open');
  },
  methods: {
    close() {
      this.$emit('close');
    },
    onKeydown(e) {
      if (e.key === 'Escape' && this.project) this.close();
      if (e.key === 'Tab') this.trapFocus(e);
    },
    trapFocus(e) {
      // Minimal focus trap: keep Tab cycling inside the dialog.
      const panel = document.querySelector('.modal-panel');
      if (!panel) return;
      const focusables = panel.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
  },
};
</script>

<style>
/* Global (teleported) styles so the dialog renders above everything. */
html.is-modal-open {
  overflow: hidden;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9990;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(10, 22, 34, 0.42);
  backdrop-filter: blur(6px);
}

.modal-panel {
  position: relative;
  width: min(920px, 100%);
  max-height: min(86vh, 880px);
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid #c8bb9f;
  background: #f7f1e6;
  box-shadow: 0 40px 90px -40px rgba(10, 22, 34, 0.55);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid #c8bb9f;
  background: #f4efe5;
  color: #0e2033;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.modal-close:hover {
  background: #c43d2c;
  color: #fbf8f2;
  border-color: #c43d2c;
  transform: rotate(90deg);
}

.modal-scroll {
  overflow-y: auto;
  max-height: min(86vh, 880px);
  padding: 2.75rem 2rem 2.25rem;
}

.modal-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.modal-num { color: #c43d2c; }
.modal-cat { color: #5b7a99; }
.modal-ongoing {
  color: #c43d2c;
  border: 1px solid rgba(196, 61, 44, 0.35);
  border-radius: 999px;
  padding: 0.15rem 0.6rem;
}

.modal-title {
  margin-top: 0.75rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: #0e2033;
}

.modal-media {
  margin-top: 1.5rem;
  border-radius: 0.875rem;
  overflow: hidden;
  border: 1px solid #c8bb9f;
}
.modal-media img {
  width: 100%;
  height: auto;
  display: block;
}

.modal-meta {
  display: grid;
  gap: 0.4rem;
  margin-top: 1.5rem;
}
.mm-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1rem;
  font-size: 0.95rem;
}
.mm-row dt {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #77808c;
  padding-top: 0.15rem;
}
.mm-row dd {
  color: #0e2033;
}

.modal-desc {
  margin-top: 1.25rem;
  color: #3a4653;
  line-height: 1.65;
  font-size: 0.98rem;
  white-space: pre-line;
}

.modal-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.5rem;
}
.mtech {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: #0e2033;
  border: 1px solid #c8bb9f;
  border-radius: 0.4rem;
  padding: 0.28rem 0.55rem;
  background: #f4efe5;
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}
.ma-primary,
.ma-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.75rem 1.1rem;
  border-radius: 0.6rem;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.ma-primary {
  background: #c43d2c;
  color: #fbf8f2;
}
.ma-primary:hover { background: #da5b43; transform: translateY(-1px); }
.ma-ghost {
  border: 1px solid #c8bb9f;
  color: #0e2033;
}
.ma-ghost:hover { border-color: #0e2033; transform: translateY(-1px); }

/* enter/leave transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(26px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-panel,
  .modal-leave-active .modal-panel {
    transition-duration: 0.01ms !important;
  }
}
</style>
