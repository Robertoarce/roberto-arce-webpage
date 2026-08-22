# Fine-tuning the chatbot models (CV-only)

This folder contains everything needed to truly fine-tune the chatbot's small LLMs so
they answer **only** questions about Roberto's CV, then quantize them for WebLLM.

**Status: done** — `Llama-3.2-3B-Instruct` and `Llama-3.2-1B-Instruct` were LoRA-tuned
on the RTX 5080, quantized to `q4f16_1` and verified in the browser (answers grounded on
the CV, off-topic questions get the trained refusal). Quantized weights live in
`finetuning/output/llama-3-2-*-ft-q4/` (gitignored).

## Pipeline

```
generate-dataset.mjs   -> train.jsonl / eval.jsonl   (CV-grounded Q&A + refusals)
train.py               -> finetuning/output/<name>    (merged LoRA, HF format)
wsl-build-mamba.sh     -> LLVM 18 via micromamba (WSL, no sudo)
wsl-build-tvm.sh       -> TVM compiler build (WSL)
convert-src.sh         -> finetuning/output/<name>-q4 (MLC q4f16_1, WebLLM-ready)
serve-models.mjs       -> local CORS server for the weights (dev only)
```

## 1. Train (Windows, RTX 5080)

- torch cu128: `pip install torch --index-url https://download.pytorch.org/whl/cu128`
- `pip install "transformers>=4.49" "peft>=0.15" "trl>=0.18" "datasets>=3.2" accelerate`
- Dataset: `node finetuning/generate-dataset.mjs` (~250 samples from `src/data/cv.js` + `src/data/roberto.txt`; completion-only loss masking).
- Train: `python finetuning/train.py --model unsloth/Llama-3.2-3B-Instruct --name llama-3-2-3b-ft` (unsloth mirrors = ungated copies of the identical meta-llama weights). ~2 min per model on the 5080.
- Sanity-check answers: `python finetuning/eval-model.py finetuning/output/llama-3-2-3b-ft`

## 2. Quantize to WebLLM (q4f16_1) — WSL Ubuntu

The pip MLC wheels are mutually inconsistent (ABI + python-API mismatches), so the
reliable path is a source build inside WSL:

```bash
# one-time toolchain (already done on this machine):
wsl -d Ubuntu -e bash /mnt/c/00\ ALL/00\ Projects/10\ Web-roberto/finetuning/wsl-build-mamba.sh   # LLVM 18 via micromamba
wsl -d Ubuntu -e bash /mnt/c/00\ ALL/00\ Projects/10\ Web-roberto/finetuning/wsl-build-tvm.sh      # TVM compiler (+ USE_CYTHON=ON)
# + pip install -e of the tvm-ffi submodule (done as part of the setup)

# convert both models (idempotent — skips existing conversions):
wsl -d Ubuntu -e bash /mnt/c/00\ ALL/00\ Projects/10\ Web-roberto/finetuning/convert-src.sh
```

`convert-src.sh` runs `mlc_llm convert_weight` (q4f16_1, CPU) + `gen_config`
(conv-template `llama-3_1`, context 4096). No wasm compilation is needed: the WebLLM
app reuses MLC's prebuilt model library for the same architecture+quantization
(`Llama-3.2-3B-Instruct-q4f16_1_cs1k-webgpu.wasm` / `...-1B-...`).

## 3. Serve / host the weights

- **Local (dev):** `node finetuning/serve-models.mjs` → serves `finetuning/output/` with CORS
  at `http://localhost:8199/resolve/main/...`. The dev build reads it automatically
  (`MODEL_BASE_URL` in `src/utils/localLLM.js`).
- **Production (done):** weights are live at
  `https://huggingface.co/Titorium/roberto-cv-models` (public, `resolve/main/` URLs verified).
  `MODEL_BASE_URL` in `src/utils/localLLM.js` points there for production builds.
  Re-upload with `python finetuning/upload-hf.py` after retraining.

## 4. Verify

Open `/chatbot` (dev server + model server running), pick a fine-tuned preset and ask:
- "What did Roberto do at Deezer?" → grounded CV answer
- "Where does Roberto work now?" → Sanofi, current role
- "What is the capital of France?" → the trained refusal

Fine-tuned models answer from their **weights** (no RAG injection). Only these two presets
are exposed in the app — the stock/untuned models were removed.

## Notes / known limitations

- The 221-sample dataset gives strong refusals and current-role answers; some open-ended
  role questions can drift (e.g. Deezer dates) — improve by adding more paraphrases in
  `generate-dataset.mjs` and retraining (2 min per model).
- The Windows MLC wheels (`mlc_llm_nightly_cpu` + `mlc_ai_nightly_cpu` from the mlc.ai
  release page) segfault during quantization — do not use them; use the WSL source build.
