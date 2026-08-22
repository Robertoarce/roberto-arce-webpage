"""
Quantize a fine-tuned HF model to WebLLM's q4f16_1 MLC format.

Requires: pip install the mlc-llm nightly wheel (see finetuning/README.md).

Usage:
    python finetuning/convert-to-webllm.py --model-dir finetuning/output/llama-3-2-3b-ft --name llama-3-2-3b-ft-q4 --conv-template llama-3_1

Output: finetuning/output/<name>/  (mlc-chat-config.json + quantized params)
The WebLLM app reuses the PREBUILT model library wasm for the same architecture,
so no wasm compilation is needed.
"""
import argparse
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(cmd, cwd=None):
    print('$ ' + ' '.join(cmd))
    result = subprocess.run(cmd, cwd=cwd)
    if result.returncode != 0:
        sys.exit(f'command failed: {" ".join(cmd)}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model-dir', required=True)
    parser.add_argument('--name', required=True)
    parser.add_argument('--conv-template', default='llama-3_1')
    parser.add_argument('--context-length', type=int, default=4096)
    parser.add_argument('--quantization', default='q4f16_1')
    args = parser.parse_args()

    model_dir = os.path.abspath(args.model_dir)
    out_dir = os.path.join(ROOT, 'finetuning', 'output', args.name)
    os.makedirs(out_dir, exist_ok=True)

    run([
        sys.executable, '-m', 'mlc_llm', 'convert_weight',
        model_dir,
        '--quantization', args.quantization,
        '--source-format', 'hf',
        '--output', out_dir,
    ])
    run([
        sys.executable, '-m', 'mlc_llm', 'gen_config',
        model_dir,
        '--quantization', args.quantization,
        '--conv-template', args.conv_template,
        '--context-length', str(args.context_length),
        '--output', out_dir,
    ])
    print(f'\nDONE -> {out_dir}')
    print('Host this folder on any static server (or HuggingFace) and point')
    print("MODEL_BASE_URL in src/utils/localLLM.js at it.")


if __name__ == '__main__':
    main()
