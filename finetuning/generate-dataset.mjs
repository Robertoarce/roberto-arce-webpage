// Generates the CV-only fine-tuning dataset (ShareGPT format) from the
// single source of truth: src/data/cv.js + src/data/roberto.txt.
// Output: finetuning/train.jsonl + finetuning/eval.jsonl
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { works } from '../src/data/cv.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const robertoRaw = readFileSync(join(root, 'src/data/roberto.txt'), 'utf8');
const outDir = join(root, 'finetuning');
mkdirSync(outDir, { recursive: true });

const SYSTEM = `You are Roberto Arce's CV assistant. Answer the user's question using only the CV facts you were trained on.
- Answer in 1-3 short sentences.
- Name companies, roles, years and technologies when relevant.
- Never invent companies, roles, dates, technologies or projects.
- If the question is not about Roberto Arce's work experience, education, skills or projects, reply exactly: "That's not on my CV — I can only answer about Roberto's work experience, education and skills."`;

const REFUSAL = "That's not on my CV — I can only answer about Roberto's work experience, education and skills.";

const samples = [];

function add(q, a) {
  samples.push({
    conversations: [
      { from: 'system', value: SYSTEM },
      { from: 'human', value: q },
      { from: 'gpt', value: a },
    ],
  });
}

// ---------- helpers ----------
const clean = (text) =>
  String(text || '')
    .replace(/<</g, '')
    .replace(/>>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const periodOf = (w) => {
  const d = w.date.trim();
  return w.duration && w.duration.trim() && !/ongoing/i.test(w.duration)
    ? `${d} (${w.duration.trim()})`
    : d;
};

const companyOf = (w) => w.company.trim();

function summary(w, maxLen = 420) {
  const desc = clean(w.description);
  let body = desc;
  if (body.length > maxLen) body = body.slice(0, maxLen) + '…';
  return `${w.title} at ${companyOf(w)} (${periodOf(w)}), ${w.city}, ${w.country}. ${body}`;
}

// ---------- per-role grounded QA (multiple phrasings) ----------
for (const w of works) {
  const company = companyOf(w);
  const role = w.title;
  const period = periodOf(w);
  const skills = (w.utils || []).join(', ');
  const kind = w.study ? 'studied' : w.entrepreneurship ? 'was part of' : 'worked at';

  const pairs = [
    [`What did Roberto do at ${company}?`, `${summary(w, 500)}`],
    [`What was his role at ${company}?`, `He was a ${role} at ${company} (${period}).`],
    [`When did Roberto work at ${company}?`, `He ${kind} ${company} from ${period}.`],
    [`Tell me about the ${company} job.`, summary(w, 600)],
    [`Where was the ${company} position based?`, `The ${company} role was based in ${w.city}, ${w.country}.`],
    [`What did he work on at ${company}?`, summary(w, 450)],
  ];
  if (skills) {
    pairs.push([`What technologies did Roberto use at ${company}?`, `At ${company} he used: ${skills}.`]);
    pairs.push([`Which tools were involved in the ${company} role?`, `At ${company} the main tools and technologies were: ${skills}.`]);
  }
  for (const [q, a] of pairs) add(q, a);

  if (/present|ongoing/i.test(period)) {
    add('Where does Roberto work now?', `Roberto currently works as a ${role} at ${company} (${period}), based in ${w.city}, ${w.country}.`);
    add('What is his current job?', `His current role is ${role} at ${company} (${period}).`);
    add('Where does Roberto work?', `Roberto works at ${company} as a ${role} (${period}), based in ${w.city}, ${w.country}.`);
  }
}

// ---------- education ----------
const edu = works.filter((w) => w.study);
for (const w of edu) {
  add(`What did Roberto study at ${companyOf(w)}?`, summary(w, 500));
}
add('What are his degrees?', `Roberto holds an MSc in Supply Chain, an MSc in Finance, an MSc in Management, and a Bachelor in Industrial Engineering.`);
add('What is his educational background?', `He has a Bachelor in Industrial Engineering and three Master's degrees: Supply Chain, Finance and Management.`);

// ---------- skills / bio from roberto.txt ----------
add('What programming languages does Roberto know?', `He is proficient in Python, JavaScript, Vue.js and SQL. Python is his primary language for data science and machine learning.`);
add('Which machine learning tools does he use?', `He works with scikit-learn, TensorFlow, PyTorch, Pandas and NumPy, among others.`);
add('What data visualization tools does he use?', `He uses Plotly, Matplotlib, Seaborn, D3.js and P5.js.`);
add('Which cloud platforms is he familiar with?', `He is familiar with AWS, Google Cloud Platform and Azure.`);
add('Where is Roberto based?', `Roberto is based in Paris, France.`);
add('Who is Roberto Arce?', `Roberto Arce is a Data Scientist and Machine Learning Engineer based in France, specialised in machine learning, statistical analysis and data visualization.`);
add('What certifications does Roberto have?', `He completed the Machine Learning Specialization and the Deep Learning Specialization by Andrew Ng (Stanford), has a Docker certification, and did a 6-month Disney Engineering internship at Walt Disney World.`);
add('Does Roberto have experience with Docker?', `Yes — he learned Docker in 5 days for a technical test, creating a Docker image for sales analysis with PostgreSQL integration.`);
add('Tell me about his ML pipeline project.', `He built a configuration-driven ML pipeline: you can switch datasets, target variables and models without changing code. It supports 6 algorithms with automatic hyperparameter tuning, preprocessing, class-imbalance handling and Weights & Biases experiment tracking.`);
add('What is the Marketing Mix Model work?', `At Sanofi he worked on a Marketing Mix Model using Bayesian regression to optimise a multi-million country marketing budget allocation across brands and channels.`);
add('What did he do at Sanofi?', summary(works.find((w) => /sanofi/i.test(w.company)), 700));
add('What did he do at Deezer?', summary(works.find((w) => /deezer/i.test(w.company)), 700));
add('What did he do at BlaBlaCar?', summary(works.find((w) => /blablacar/i.test(w.company)), 700));
add('What did he do at School 42?', summary(works.find((w) => /42/.test(w.company)), 500));
add('Has Roberto founded a startup?', `Yes — he co-founded a stealth startup (Jun 2022 - Dec 2022) providing access to Amazon's public data through web scraping and resilient data pipelines.`);
add('What did he do in the Station F Pioneer program?', summary(works.find((w) => /station f/i.test(w.company)), 500));
add('Does Roberto speak French?', `The CV shows he has worked in Paris, France since 2016 at companies like L'Oréal, Deezer and Sanofi; it does not explicitly list languages.`);

// ---------- projects from roberto.txt (auto-parsed) ----------
const projectSection = robertoRaw.split('## Key Projects')[1] || '';
const projectBlocks = projectSection
  .split(/\n### /)
  .slice(1)
  .map((b) => b.trim())
  .filter((b) => b.length > 40);
for (const block of projectBlocks) {
  const title = (block.match(/^([^\n]+)/) || [])[1].trim();
  const body = clean(block.replace(/^[^\n]+\n/, '').replace(/Technologies:.*$/s, ''));
  if (title && body) {
    const short = body.length > 400 ? body.slice(0, 400) + '…' : body;
    add(`Tell me about the ${title} project.`, short);
    add(`What is the ${title}?`, short);
  }
}

// ---------- refusals (off-topic) ----------
const offTopic = [
  'What is the capital of France?',
  'Write me a Python function to sort a list.',
  'What is the weather today?',
  'Who won the World Cup in 2022?',
  'Tell me a joke.',
  'How do I cook pasta?',
  'What is the meaning of life?',
  'Explain quantum physics to me.',
  'What do you think about politics?',
  'Can you help me hack a website?',
  'What is the price of Bitcoin?',
  'Recommend a good restaurant in Tokyo.',
  'Translate this to Spanish: hello world.',
  'What is your opinion on AI taking jobs?',
  'Who is the president of the United States?',
  'What movies should I watch?',
  'How does a car engine work?',
  'Who invented the telephone?',
  'What is the best programming language?',
  'Do you like pizza?',
  'How old are you?',
  'What time is it?',
  'Solve 2+2 for me.',
  'Write a poem about the ocean.',
  'What is the tallest mountain?',
  'Should I buy stocks today?',
  'Help me plan my vacation to Italy.',
  'What is the best laptop in 2026?',
  'Explain how the internet works.',
  'Do you believe in aliens?',
  'What is your favorite color?',
];
for (const q of offTopic) {
  add(q, REFUSAL);
  add(`Quick question: ${q}`, REFUSAL);
}

// ---------- paraphrases ----------
add('Where is he working at the moment?', `Roberto currently works as a Data Scientist at Sanofi (Jan 2023 - Present), based in Paris, France.`);
add("What's his current company?", `His current company is Sanofi, where he works as a Data Scientist.`);
add('What roles has Roberto had?', `His roles include: Data Scientist at Sanofi, Data Analyst/Scientist at Branded, Data Analyst at BlaBlaCar and Deezer, Digital Business Analyst at L'Oréal, Supply Chain roles at Groupe SEB, and Co-Founder of a stealth startup.`);
add('Where has Roberto worked?', `He has worked at Sanofi, Branded, BlaBlaCar, Deezer, L'Oréal, Groupe SEB, Shopshopdeco, MADEPA S.A. and Walt Disney World, among others.`);
add('Summarize his career.', `Roberto is a Data Scientist and ML Engineer currently at Sanofi in Paris. Previously he was a Data Analyst at Deezer and BlaBlaCar, a Data Analyst/Scientist at Branded, and worked in supply chain at Groupe SEB. He studied Industrial Engineering and holds three Master's degrees (Supply Chain, Finance, Management).`);
add('How many years of experience does he have?', `His timeline runs from 2007 (Walt Disney World) to the present — more than 15 years of international experience across engineering, supply chain, data analytics and data science.`);

// ---------- dedupe + split ----------
const seen = new Set();
const unique = samples.filter((s) => {
  const key = s.conversations[1].value;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// shuffle deterministically
let seed = 42;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
for (let i = unique.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [unique[i], unique[j]] = [unique[j], unique[i]];
}

const splitAt = Math.floor(unique.length * 0.9);
const train = unique.slice(0, splitAt);
const evalSet = unique.slice(splitAt);

writeFileSync(join(outDir, 'train.jsonl'), train.map((s) => JSON.stringify(s)).join('\n'), 'utf8');
writeFileSync(join(outDir, 'eval.jsonl'), evalSet.map((s) => JSON.stringify(s)).join('\n'), 'utf8');
console.log(`dataset written: ${train.length} train / ${evalSet.length} eval samples`);
console.log(`refusals: ${unique.filter((s) => s.conversations[2].value === REFUSAL).length}`);
