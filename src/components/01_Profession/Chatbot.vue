<template>
  <div class="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-4xl flex-col px-4 py-4 sm:px-6 lg:px-8">
    <!-- Model setup card -->
    <section v-if="!ready" class="card mb-4 p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="eyebrow">On-device model</p>
          <h2 class="mt-1 font-display text-lg font-semibold text-paper">
            A CV assistant that runs 100% in your browser
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            A quantized ~1–3B model accelerated with WebGPU, running entirely in your browser.
            Your questions are grounded only on the CV — nothing is sent to a server, nothing is invented.
          </p>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label for="model-select" class="mb-1.5 block text-xs font-medium text-muted">Model</label>
          <select
            id="model-select"
            v-model="selectedModelId"
            class="w-full rounded-lg border border-line bg-ink-850 px-3 py-2.5 text-sm text-paper focus:border-accent/60 focus:outline-none"
            :disabled="loading"
            @change="onModelChange"
          >
            <option v-for="preset in modelPresets" :key="preset.id" :value="preset.id">
              {{ preset.label }} — {{ preset.note }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="btn-primary min-w-[220px]"
          :disabled="loading || !secureContext || !webgpuAvailable"
          @click="loadModel"
        >
          <span v-if="loading">{{ Math.round(progress * 100) }}%</span>
          <span v-else-if="cached">Load model (cached)</span>
          <span v-else>Download &amp; load model</span>
        </button>
      </div>

      <!-- Download progress -->
      <div v-if="loading" class="mt-4">
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
          <div
            class="h-full rounded-full bg-gradient-to-r from-accent-deep to-accent-soft transition-all duration-300"
            :style="{ width: `${Math.max(4, progress * 100)}%` }"
          ></div>
        </div>
        <p class="mt-2 truncate font-mono text-[11px] text-faint">{{ progressText || 'Preparing…' }}</p>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-1.5">
        <span v-if="cached && !loading" class="chip chip-accent">Weights cached on this device</span>
        <span v-if="!secureContext" class="chip border-red-500/40 text-red-300">
          WebGPU needs HTTPS or localhost
        </span>
        <span v-else-if="webgpuChecking" class="chip">Checking WebGPU…</span>
        <span v-else-if="!webgpuAvailable" class="chip border-red-500/40 text-red-300">
          WebGPU not available — this browser can't run the model
        </span>
        <span v-else class="chip">WebGPU available{{ gpuVendor ? ` — ${gpuVendor}` : '' }}</span>
      </div>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <p class="text-xs text-faint">
          First load downloads the weights once (~0.9–2.3 GB depending on model), then they stay cached
          locally in your browser. No backend, no API keys, no telemetry.
        </p>
        <button
          v-if="cached && !loading"
          type="button"
          class="btn-quiet btn-sm"
          @click="clearCache"
        >
          Clear cached weights
        </button>
      </div>
    </section>

    <!-- Ready status row -->
    <div v-else class="mb-4 flex flex-wrap items-center justify-center gap-2">
      <span class="chip chip-accent">{{ currentModelLabel }} · on-device</span>
      <span class="chip">{{ device.vendor }}</span>
      <button type="button" class="btn-quiet btn-sm" @click="unloadModel">Unload</button>
      <button type="button" class="btn-quiet btn-sm" @click="clearCache">Clear cache</button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto pb-4" aria-live="polite">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex items-end gap-2.5"
        :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          v-if="message.type === 'bot'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-ink-800 font-display text-[11px] font-bold text-accent-soft"
          aria-hidden="true"
        >
          RA
        </div>

        <div class="max-w-[80%]">
          <div
            class="rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-card sm:text-[15px]"
            :class="
              message.type === 'user'
                ? 'rounded-br-md bg-accent text-ink-950'
                : 'rounded-bl-md border border-line bg-ink-850 text-paper'
            "
          >
            <p class="whitespace-pre-wrap break-words">
              {{ message.text }}<span v-if="message.streaming" class="cursor-blink" aria-hidden="true"></span>
            </p>
            <p
              class="mt-1.5 text-right font-mono text-[10px]"
              :class="message.type === 'user' ? 'text-ink-950/60' : 'text-faint'"
            >
              {{ formatTimestamp(message.timestamp) }}
            </p>
          </div>

          <!-- CV sources used to ground the answer -->
          <div
            v-if="message.type === 'bot' && message.sources && message.sources.length"
            class="mt-1.5 flex flex-wrap gap-1.5"
          >
            <span v-for="source in message.sources" :key="source" class="chip text-[10px] text-faint">
              {{ source }}
            </span>
          </div>
        </div>

        <div
          v-if="message.type === 'user'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[11px] font-bold text-ink-950"
          aria-hidden="true"
        >
          You
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!ready && messages.length === 0" class="mt-8 flex flex-col items-center gap-3 text-center">
        <p class="text-sm text-faint">
          Load the model above, then ask it anything about the CV — or tap one of the suggestions below.
        </p>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {{ errorMessage }}
      </p>
    </div>

    <!-- Suggestion pills -->
    <div class="border-t border-line px-1 pt-3">
      <p class="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        {{ ready ? 'Try asking' : 'It can answer' }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="q in exampleQuestions"
          :key="q"
          type="button"
          class="chip transition-colors hover:border-accent/50 hover:text-accent-soft"
          :disabled="!ready || generating"
          @click="askExample(q)"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <!-- Input -->
    <form
      class="flex flex-col gap-2 pt-3 sm:flex-row sm:items-end sm:gap-3"
      @submit.prevent="sendMessage"
    >
      <textarea
        v-model="userInput"
        @keydown="handleKeyDown"
        :placeholder="ready ? 'Ask about Roberto\'s experience, education or skills…' : 'Load the model first, then ask your question…'"
        :disabled="!ready || generating"
        :rows="2"
        class="flex-1 resize-none rounded-xl border border-line bg-ink-850 px-4 py-3 text-sm text-paper placeholder-faint transition-colors duration-200 focus:border-accent/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      ></textarea>
      <button
        v-if="!generating"
        type="submit"
        :disabled="!ready || !userInput.trim()"
        class="btn-primary min-w-[110px]"
      >
        Send
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>
      </button>
      <button
        v-else
        type="button"
        class="btn-ghost min-w-[110px] border-red-500/40 text-red-300 hover:border-red-500/70"
        @click="stopGenerating"
      >
        Stop
      </button>
    </form>
  </div>
</template>

<script>
import { localLLM, MODEL_PRESETS } from '../../utils/localLLM.js';

export default {
  name: 'ChatInterface',
  data() {
    return {
      modelPresets: MODEL_PRESETS,
      selectedModelId: MODEL_PRESETS[0].id,
      messages: [],
      userInput: '',
      ready: false,
      loading: false,
      generating: false,
      interrupted: false,
      progress: 0,
      progressText: '',
      cached: false,
      errorMessage: null,
      secureContext: typeof window !== 'undefined' ? window.isSecureContext : true,
      webgpuChecking: true,
      webgpuAvailable: false,
      gpuVendor: '',
      device: { webgpu: false, vendor: 'WebGPU' },
      exampleQuestions: [
        'Where does Roberto work now?',
        'What did he do at Deezer?',
        'What did he do at Sanofi?',
        'What are his degrees?',
        'Which tools did he use at Sanofi?',
        'What did he do at BlaBlaCar?',
        'Does Roberto have experience with Docker?',
        'What certifications does Roberto have?',
      ],
    };
  },
  computed: {
    currentModelLabel() {
      const preset = this.modelPresets.find((p) => p.id === this.selectedModelId);
      return preset ? preset.label : this.selectedModelId;
    },
  },
  async mounted() {
    this.refreshCacheState();
    const gpu = await localLLM.detectWebGPU();
    this.webgpuAvailable = gpu.available;
    this.gpuVendor = gpu.vendor;
    this.webgpuChecking = false;
  },
  methods: {
    async refreshCacheState() {
      this.cached = await localLLM.isModelCached(this.selectedModelId);
    },
    async onModelChange() {
      this.errorMessage = null;
      await this.refreshCacheState();
    },
    async loadModel() {
      if (this.loading) return;
      this.loading = true;
      this.progress = 0;
      this.progressText = 'Preparing…';
      this.errorMessage = null;
      try {
        await localLLM.load(this.selectedModelId, ({ progress, text }) => {
          this.progress = progress;
          this.progressText = text;
        });
        this.ready = true;
        this.device = await localLLM.getDevice();
        await this.refreshCacheState();
      } catch (error) {
        console.error('Model load failed:', error);
        const message = error?.message || String(error);
        if (/gpu|webgpu|compatible/i.test(message)) {
          this.errorMessage =
            'WebGPU is not available in this browser. Enable hardware acceleration (chrome://settings → System) or use a WebGPU-capable browser (Chrome/Edge 113+), then try again.';
        } else {
          this.errorMessage = `Could not load the model: ${message}. Check your connection and try again.`;
        }
      } finally {
        this.loading = false;
      }
    },
    async unloadModel() {
      this.generating = false;
      await localLLM.unload();
      this.ready = false;
    },
    async clearCache() {
      try {
        await localLLM.clearModelCache(this.selectedModelId);
        this.cached = false;
      } catch (error) {
        console.error('Cache clear failed:', error);
      }
    },
    askExample(question) {
      this.userInput = question;
      this.sendMessage();
    },
    handleKeyDown(event) {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !this.generating) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    async sendMessage() {
      if (!this.ready || this.generating || !this.userInput.trim()) return;

      const question = this.userInput.trim();
      this.userInput = '';
      this.errorMessage = null;
      this.interrupted = false;

      this.messages.push({
        type: 'user',
        text: question,
        timestamp: new Date(),
      });

      const botMessage = { type: 'bot', text: '', sources: [], timestamp: new Date(), streaming: true };
      this.messages.push(botMessage);
      this.generating = true;

      try {
        for await (const part of localLLM.generateStream(question)) {
          botMessage.text += part.content;
          if (part.sources && part.sources.length) {
            botMessage.sources = part.sources;
          }
          this.scrollToBottom();
        }
        // Guard: tiny models occasionally echo the prompt instead of answering.
        if (/CV facts:\s*\[1\]/.test(botMessage.text)) {
          botMessage.text = 'Could you rephrase that? I want to make sure I ground the answer on the CV.';
        }
      } catch (error) {
        console.error('Generation error:', error);
        if (!this.interrupted) {
          this.errorMessage = `Generation failed: ${error.message || error}.`;
        }
      } finally {
        botMessage.streaming = false;
        this.generating = false;
        this.scrollToBottom();
      }
    },
    stopGenerating() {
      this.interrupted = true;
      localLLM.interrupt();
      this.generating = false;
      const last = this.messages[this.messages.length - 1];
      if (last && last.type === 'bot') last.streaming = false;
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },
    formatTimestamp(timestamp) {
      return new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(timestamp);
    },
  },
};
</script>

<style scoped>
.cursor-blink::after {
  content: '|';
  animation: blink 1s step-end infinite;
  color: var(--accent);
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
