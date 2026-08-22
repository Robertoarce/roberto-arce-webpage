"""
LoRA fine-tuning for the CV-only chatbot models, on NVIDIA RTX 5080 (sm_120).

Usage:
    python finetuning/train.py --model meta-llama/Llama-3.2-3B-Instruct --name llama-3-2-3b-ft
    python finetuning/train.py --model meta-llama/Llama-3.2-1B-Instruct --name llama-3-2-1b-ft

Outputs the merged model to finetuning/output/<name>/ (ready for mlc-llm conversion).

Loss is computed ONLY on the assistant turn (completion-only masking, hand-rolled
so it works across transformers/trl versions).
"""
import argparse
import json
import os
import sys

# Windows console encoding (answers contain non-cp1252 chars)
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import torch
from datasets import Dataset
from peft import LoraConfig, get_peft_model, TaskType
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYSTEM_PROMPT = (
    "You are Roberto Arce's CV assistant. Answer the user's question using only the CV facts "
    "you were trained on.\n"
    "- Answer in 1-3 short sentences.\n"
    "- Name companies, roles, years and technologies when relevant.\n"
    "- Never invent companies, roles, dates, technologies or projects.\n"
    "- If the question is not about Roberto Arce's work experience, education, skills or projects, "
    'reply exactly: "That\'s not on my CV — I can only answer about Roberto\'s work experience, education and skills."'
)


def load_samples(path):
    samples = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                samples.append(json.loads(line))
    return samples


def find_subseq(ids, needle):
    for i in range(len(ids) - len(needle) + 1):
        if ids[i:i + len(needle)] == needle:
            return i
    return -1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True, help='base model HF id')
    parser.add_argument('--name', required=True, help='output folder name')
    parser.add_argument('--epochs', type=float, default=4.0)
    parser.add_argument('--lr', type=float, default=1.5e-4)
    parser.add_argument('--max-seq', type=int, default=1536)
    args = parser.parse_args()

    assert torch.cuda.is_available(), 'CUDA not available'
    print(f'GPU: {torch.cuda.get_device_name(0)} ({torch.cuda.get_device_capability(0)})')

    out_dir = os.path.join(ROOT, 'finetuning', 'output', args.name)
    os.makedirs(out_dir, exist_ok=True)

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = 'right'

    # Assistant marker ids (Llama-3 chat template)
    marker = tokenizer.encode('<|start_header_id|>assistant<|end_header_id|>', add_special_tokens=False)
    print('assistant marker ids:', marker)

    # ShareGPT -> HF chat roles ('gpt'/'human' are not template roles)
    ROLE_MAP = {'system': 'system', 'human': 'user', 'user': 'user', 'gpt': 'assistant', 'assistant': 'assistant'}

    def preprocess(sample):
        # Ensure the system prompt matches the dataset one
        convs = list(sample['conversations'])
        if convs and convs[0]['from'] == 'system':
            convs[0]['value'] = SYSTEM_PROMPT
        msgs = [{'role': ROLE_MAP.get(m['from'], 'user'), 'content': m['value']} for m in convs]
        text = tokenizer.apply_chat_template(msgs, tokenize=False)
        enc = tokenizer(text, truncation=True, max_length=args.max_seq, add_special_tokens=True)
        ids = enc['input_ids']
        labels = [-100] * len(ids)
        idx = find_subseq(ids, marker)
        if idx != -1:
            start = idx + len(marker)
            labels[start:] = ids[start:]  # loss only on the assistant response
        enc['labels'] = labels
        return enc

    def tokenize_dataset(ds):
        return ds.map(preprocess, remove_columns=ds.column_names)

    train_ds = tokenize_dataset(Dataset.from_list(load_samples(os.path.join(ROOT, 'finetuning', 'train.jsonl'))))
    print('train size:', len(train_ds))

    # Hand-rolled collator: pads input_ids with pad_token, labels with -100.
    # (DataCollatorForLanguageModeling mis-pads labels in transformers 5.)
    def collate(features):
        max_len = max(len(f['input_ids']) for f in features)
        pad_id = tokenizer.pad_token_id

        def pad(seq, value):
            return torch.tensor(seq + [value] * (max_len - len(seq)), dtype=torch.long)

        return {
            'input_ids': torch.stack([pad(f['input_ids'], pad_id) for f in features]),
            'attention_mask': torch.stack([pad(f['attention_mask'], 0) for f in features]),
            'labels': torch.stack([pad(f['labels'], -100) for f in features]),
        }

    model = AutoModelForCausalLM.from_pretrained(
        args.model,
        dtype=torch.bfloat16,
        attn_implementation='sdpa',
    )
    model.config.use_cache = False

    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias='none',
        task_type=TaskType.CAUSAL_LM,
        target_modules=[
            'q_proj', 'k_proj', 'v_proj', 'o_proj',
            'gate_proj', 'up_proj', 'down_proj',
        ],
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    data_collator = collate

    training_args = TrainingArguments(
        output_dir=os.path.join(out_dir, 'checkpoints'),
        num_train_epochs=args.epochs,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=args.lr,
        lr_scheduler_type='cosine',
        warmup_steps=4,
        bf16=True,
        logging_steps=5,
        save_strategy='no',
        report_to=[],
        seed=42,
        dataloader_num_workers=0,
        gradient_checkpointing=True,
        max_grad_norm=1.0,
        remove_unused_columns=False,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        data_collator=data_collator,
    )

    trainer.train()

    # ---- merge + export ----
    merged = trainer.model.merge_and_unload()
    merged.save_pretrained(out_dir)
    tokenizer.save_pretrained(out_dir)
    print(f'DONE -> {out_dir}')

    # ---- quick sanity generations ----
    merged.eval().to('cuda')
    for q in [
        'What did Roberto do at Deezer?',
        'Where does Roberto work now?',
        'What is the capital of France?',
    ]:
        msgs = [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': q},
        ]
        text = tokenizer.apply_chat_template(msgs, tokenize=False, add_generation_prompt=True)
        inputs = tokenizer(text, return_tensors='pt').to('cuda')
        out = merged.generate(
            inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_new_tokens=120,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )
        answer = tokenizer.decode(out[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
        print(f'\n--- Q: {q}\n{answer.strip()}')


if __name__ == '__main__':
    main()
