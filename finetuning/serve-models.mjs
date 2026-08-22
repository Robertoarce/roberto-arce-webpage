// Local CORS-enabled static server for the quantized model weights.
// The dev build of the chatbot loads fine-tuned weights from http://localhost:8199.
// Usage: node finetuning/serve-models.mjs  (serves finetuning/output on port 8199)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'output');
const PORT = 8199;

const MIME = {
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.bin': 'application/octet-stream',
  '.txt': 'text/plain',
  '.safetensors': 'application/octet-stream',
};

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // WebLLM appends "/resolve/main/" (HuggingFace convention) to the model base URL
  const normalized = urlPath.replace(/^\/resolve\/main\//, '/');
  const file = normalize(join(ROOT, normalized));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }
  try {
    const data = await readFile(file);
    res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream');
    res.writeHead(200).end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
});

server.listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}`));
