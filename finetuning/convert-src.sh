#!/usr/bin/env bash
# Convert fine-tuned models to WebLLM q4f16_1 using source-built mlc-llm + tvm.
set -e
MLC=/home/roberto/mlc-llm
TVM="$MLC/3rdparty/tvm"
TVM_BUILD="$TVM/build"
export PYTHONPATH="$MLC/python:$TVM/python:$TVM/3rdparty/tvm-ffi/python:$PYTHONPATH"
export LD_LIBRARY_PATH="$TVM_BUILD/lib:$MLC/build/lib:/home/roberto/llvm-env/lib:$LD_LIBRARY_PATH"
cd "/mnt/c/00 ALL/00 Projects/10 Web-roberto"

for MODEL in llama-3-2-3b-ft llama-3-2-1b-ft; do
  OUT="finetuning/output/${MODEL}-q4"
  if [ ! -f "$OUT/tensor-cache.json" ]; then
    echo "=== converting $MODEL (q4f16_1) ==="
    python3 -m mlc_llm convert_weight \
      "finetuning/output/$MODEL" \
      --quantization q4f16_1 \
      --source-format huggingface-safetensor \
      --device cpu \
      --output "$OUT" || exit 1
  else
    echo "=== $MODEL already converted, skipping ==="
  fi

  echo "=== gen_config $MODEL ==="
  python3 -m mlc_llm gen_config \
    "finetuning/output/$MODEL" \
    --quantization q4f16_1 \
    --conv-template llama-3_1 \
    --context-window-size 4096 \
    --output "$OUT" || exit 1
done

echo "ALL CONVERSIONS DONE"
