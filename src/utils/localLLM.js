// On-device LLM wrapper built on WebLLM (@mlc-ai/web-llm).
// The model runs 100% in the browser (WebGPU), no backend, no paid APIs.
// Only the fine-tuned, CV-locked models are used (see finetuning/).
import {
  CreateMLCEngine,
  prebuiltAppConfig,
  hasModelInCache,
  deleteModelAllInfoInCache,
} from '@mlc-ai/web-llm';

/**
 * Where the quantized fine-tuned weights live.
 * - dev: the local CORS server started with `node finetuning/serve-models.mjs`
 * - prod: a HuggingFace repo (upload finetuning/output/*-q4 and set the URL below)
 */
const MODEL_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8199/resolve/main'
  : 'https://huggingface.co/Titorium/roberto-cv-models';

/** Fine-tuned models: weights come from our server, wasm lib reused from MLC. */
const FINE_TUNED_MODELS = [
  {
    id: 'Roberto-CV-Llama-3.2-3B-q4f16_1-MLC',
    label: 'Roberto CV 3B (fine-tuned)',
    note: '~2.3 GB · CV-only · best quality',
    fineTuned: true,
    record: {
      model: `${MODEL_BASE_URL}/llama-3-2-3b-ft-q4`,
      model_id: 'Roberto-CV-Llama-3.2-3B-q4f16_1-MLC',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Llama-3.2-3B-Instruct-q4f16_1_cs1k-webgpu.wasm',
    },
  },
  {
    id: 'Roberto-CV-Llama-3.2-1B-q4f16_1-MLC',
    label: 'Roberto CV 1B (fine-tuned)',
    note: '~0.9 GB · CV-only · fastest',
    fineTuned: true,
    record: {
      model: `${MODEL_BASE_URL}/llama-3-2-1b-ft-q4`,
      model_id: 'Roberto-CV-Llama-3.2-1B-q4f16_1-MLC',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Llama-3.2-1B-Instruct-q4f16_1_cs1k-webgpu.wasm',
    },
  },
];

export const MODEL_PRESETS = FINE_TUNED_MODELS;

const appConfig = {
  ...prebuiltAppConfig,
  model_list: [
    ...prebuiltAppConfig.model_list,
    ...FINE_TUNED_MODELS.map((m) => m.record),
  ],
};

/**
 * Prompt for the FINE-TUNED models — must match finetuning/train.py SYSTEM_PROMPT
 * exactly: the CV lives in the weights, no RAG injection needed.
 */
const TRAINED_SYSTEM_PROMPT =
  "You are Roberto Arce's CV assistant. Answer the user's question using only the CV facts " +
  'you were trained on.\n' +
  '- Answer in 1-3 short sentences.\n' +
  '- Name companies, roles, years and technologies when relevant.\n' +
  '- Never invent companies, roles, dates, technologies or projects.\n' +
  "- If the question is not about Roberto Arce's work experience, education, skills or projects, " +
  'reply exactly: "That\'s not on my CV — I can only answer about Roberto\'s work experience, education and skills."';

class CVAssistant {
  constructor() {
    this.engine = null;
    this.loadedModelId = null;
    this.loading = false;
  }

  get isReady() {
    return this.engine !== null && !this.loading;
  }

  /**
   * Load (or switch to) a model. Throws on failure; resolves when ready.
   * @param {string} modelId
   * @param {(p: {progress: number, text: string}) => void} onProgress 0..1
   */
  async load(modelId, onProgress = () => {}) {
    if (this.engine && this.loadedModelId === modelId && !this.loading) return;

    if (this.loading) {
      throw new Error('A model is already loading.');
    }

    // Unload any previously loaded model before switching
    if (this.engine) {
      await this.unload();
    }

    this.loading = true;
    try {
      const engine = await CreateMLCEngine(modelId, {
        appConfig,
        initProgressCallback: (report) => {
          onProgress({ progress: report.progress, text: report.text });
        },
      });
      this.engine = engine;
      this.loadedModelId = modelId;
    } catch (error) {
      console.error('[WebLLM] failed to load model:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async unload() {
    try {
      if (this.engine) await this.engine.unload();
    } catch (error) {
      console.warn('[WebLLM] unload warning:', error);
    }
    this.engine = null;
    this.loadedModelId = null;
  }

  interrupt() {
    if (this.engine) this.engine.interruptGenerate();
  }

  /**
   * Answer a question from the fine-tuned weights, streaming tokens.
   * The CV is baked into the model — no retrieval needed.
   */
  async *generateStream(question) {
    const messages = [
      { role: 'system', content: TRAINED_SYSTEM_PROMPT },
      { role: 'user', content: question },
    ];

    const chunks = await this.engine.chat.completions.create({
      messages,
      temperature: 0.2,
      top_p: 0.85,
      max_tokens: 220,
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of chunks) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        yield { content: delta, sources: [], grounded: true };
      }
    }
  }

  /**
   * GPU info: WebGPU vendor or CPU fallback.
   * @returns {Promise<{webgpu: boolean, vendor: string}>}
   */
  async getDevice() {
    if (typeof navigator !== 'undefined' && !navigator.gpu) {
      return { webgpu: false, vendor: 'WebGPU unavailable' };
    }
    try {
      const vendor = await this.engine.getGPUVendor();
      return { webgpu: true, vendor };
    } catch {
      return { webgpu: false, vendor: 'WebGPU unavailable' };
    }
  }

  /**
   * Real WebGPU availability check (adapter request, not just navigator.gpu).
   * @returns {Promise<{available: boolean, vendor: string}>}
   */
  async detectWebGPU() {
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      return { available: false, vendor: '' };
    }
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return { available: false, vendor: '' };
      const vendor = adapter.info?.vendor || adapter.info?.description || 'WebGPU';
      return { available: true, vendor };
    } catch {
      return { available: false, vendor: '' };
    }
  }

  /** Whether the model weights are already cached in the browser. */
  async isModelCached(modelId) {
    try {
      return await hasModelInCache(modelId, appConfig);
    } catch {
      return false;
    }
  }

  /** Delete cached weights for a model (frees browser storage). */
  async clearModelCache(modelId) {
    await deleteModelAllInfoInCache(modelId, appConfig);
  }
}

export const localLLM = new CVAssistant();
