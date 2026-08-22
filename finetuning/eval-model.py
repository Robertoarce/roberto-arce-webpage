"""Evaluate a fine-tuned (merged) model on the 3 sanity questions."""
import sys

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

sys.path.insert(0, '.')
from finetuning.train import SYSTEM_PROMPT  # noqa: E402

MODEL_DIR = sys.argv[1] if len(sys.argv) > 1 else 'finetuning/output/llama-3-2-3b-ft'

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForCausalLM.from_pretrained(MODEL_DIR, dtype=torch.bfloat16, attn_implementation='sdpa').cuda().eval()

questions = [
    'What did Roberto do at Deezer?',
    'Where does Roberto work now?',
    'What did he study?',
    'What is the capital of France?',
    'Which tools did he use at Sanofi?',
]

for q in questions:
    msgs = [
        {'role': 'system', 'content': SYSTEM_PROMPT},
        {'role': 'user', 'content': q},
    ]
    text = tokenizer.apply_chat_template(msgs, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(text, return_tensors='pt').to('cuda')
    out = model.generate(
        inputs['input_ids'],
        attention_mask=inputs['attention_mask'],
        max_new_tokens=140,
        do_sample=False,
        pad_token_id=tokenizer.eos_token_id,
    )
    answer = tokenizer.decode(out[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
    print(f'--- Q: {q}\n    A: {answer.strip()}\n')
