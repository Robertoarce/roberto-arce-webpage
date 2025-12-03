# Fine-tuning Scripts for Roberto's Chatbot

This folder contains scripts and data for fine-tuning or improving the chatbot's LLM responses to reduce hallucination.

## Current Setup

The chatbot uses **TinyLlama 1.1B Chat** via `@xenova/transformers` running entirely in the browser.

### Model Details

- **Model**: `Xenova/TinyLlama-1.1B-Chat-v1.0`
- **Size**: ~700MB (quantized)
- **Type**: Instruction-tuned chat model
- **Runtime**: Client-side (browser) using WebGPU/WASM

## Anti-Hallucination Strategy

1. **RAG (Retrieval-Augmented Generation)**: The LLM only sees relevant context from `roberto.txt`
2. **Strict System Prompt**: Instructs the model to ONLY use provided context
3. **Low Temperature (0.1)**: Reduces randomness in generation
4. **Context Grounding**: Every response is grounded in retrieved documents

## Files

| File                        | Purpose                         |
| --------------------------- | ------------------------------- |
| `training_data.json`        | Q&A pairs for reference/testing |
| `generate_training_data.py` | Extract Q&A from roberto.txt    |
| `test_responses.py`         | Validate responses for accuracy |

## If Hallucination Persists

### Option 1: Reduce Temperature Further

In `localLLM.js`, set `temperature: 0.0` for fully deterministic output.

### Option 2: Use a Smaller/Different Model

Try these alternatives in `localLLM.js`:

```javascript
// Smaller, faster model
modelName: "Xenova/distilgpt2";

// Alternative instruction-tuned models
modelName: "Xenova/Qwen1.5-0.5B-Chat";
modelName: "Xenova/phi-2";
```

### Option 3: Fine-tune the Model (Advanced)

1. Use `generate_training_data.py` to create training data
2. Fine-tune using HuggingFace Transformers
3. Convert to ONNX format for Xenova
4. Host on HuggingFace Hub

## Training Data Format

```json
{
  "conversations": [
    {
      "input": "What programming languages do you know?",
      "output": "My programming expertise includes Python, JavaScript, Vue.js, and SQL..."
    }
  ]
}
```

## Testing

Run `test_responses.py` to validate chatbot accuracy:

```bash
cd finetuning
python test_responses.py
```

## Notes

- First load downloads ~700MB model (cached afterward)
- WebGPU acceleration used when available
- Falls back to WASM on older browsers
