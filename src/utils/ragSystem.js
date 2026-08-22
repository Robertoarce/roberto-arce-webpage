// CV-grounded retrieval for Roberto's chatbot.
// Corpus = roberto.txt (bio/education/skills) + src/data/cv.js (timeline entries).
// The retrieved snippets are the ONLY facts the model is allowed to use.
import robertoRaw from '/src/data/roberto.txt?raw';
import { works } from '/src/data/cv.js';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'what', 'when', 'where', 'who', 'which',
  'does', 'did', 'have', 'has', 'was', 'were', 'are', 'about', 'your', 'his',
  'her', 'their', 'this', 'that', 'they', 'them', 'then', 'than', 'there',
  'been', 'being', 'tell', 'know', 'work', 'works', 'working', 'worked',
  'experience', 'background', 'info', 'information', 'please', 'roberto',
]);

class RAGSystem {
  constructor() {
    this.chunks = [];
    this.isInitialized = false;
    this.idf = new Map();
  }

  async initialize() {
    if (this.isInitialized) return;
    this.chunks = this.buildChunks(robertoRaw, works);
    this.computeIdf();
    this.isInitialized = true;
  }

  // ---------- Corpus construction ----------

  buildChunks(robertoRawText, worksList) {
    const chunks = [];

    // --- roberto.txt: split into sections on markdown headings ---
    const EXCLUDED_SECTIONS = /conversation examples|philosophy/i;
    const sections = robertoRawText.split(/\n(?=#{2,3}\s)/);
    for (const section of sections) {
      const heading = (section.match(/^#+\s*(.+)$/m) || [])[1] || 'Profile';
      // "Conversation Examples" are canned Q&As with invented details; "Philosophy"
      // is opinion, not CV fact. Neither may ground answers.
      if (EXCLUDED_SECTIONS.test(heading)) continue;
      const clean = cleanText(section);
      if (clean.length < 30) continue;
      chunks.push({
        id: `bio_${chunks.length}`,
        kind: 'bio',
        label: heading.trim(),
        text: clean,
        company: '',
        title: heading.trim(),
        skills: '',
      });
    }

    // --- Timeline entries: one structured chunk per role ---
    for (const work of worksList) {
      const description = cleanText(stripFormattingMarkers(work.description || ''));
      const text = [
        `Role: ${work.title}`,
        `Company: ${work.company}`,
        `Period: ${work.date}${work.duration ? ` (${work.duration})` : ''}`,
        `Location: ${work.city}, ${work.country}`,
        description ? `Details: ${description}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const skills = Array.isArray(work.utils) ? work.utils.join(', ') : '';
      chunks.push({
        id: `work_${chunks.length}`,
        kind: work.study ? 'education' : work.entrepreneurship ? 'entrepreneur' : 'work',
        label: `${work.company.trim()} — ${work.title}`,
        text,
        company: work.company.toLowerCase(),
        title: work.title.toLowerCase(),
        skills: skills.toLowerCase(),
        date: work.date.toLowerCase(),
      });
    }

    return chunks;
  }

  computeIdf() {
    const n = this.chunks.length;
    const df = new Map();
    for (const chunk of this.chunks) {
      const seen = new Set();
      for (const token of tokenize(chunk.text)) {
        if (!seen.has(token)) {
          seen.add(token);
          df.set(token, (df.get(token) || 0) + 1);
        }
      }
    }
    this.idf = new Map();
    for (const [token, count] of df) {
      this.idf.set(token, 1 + Math.log(n / (1 + count)));
    }
  }

  // ---------- Retrieval ----------

  scoreChunk(queryTokens, queryLower, chunk) {
    const textLower = chunk.text.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      if (!containsToken(textLower, token)) continue;
      const weight = this.idf.get(token) || 1;
      score += weight;
      if (chunk.company && containsToken(chunk.company, token)) score += weight * 2.2;
      if (chunk.title && containsToken(chunk.title, token)) score += weight * 1.6;
      if (chunk.skills && containsToken(chunk.skills, token)) score += weight * 1.2;
      if (chunk.date && containsToken(chunk.date, token)) score += weight * 1.2;
    }

    // "Where does he work?" style questions must surface the CURRENT role
    const asksCurrentRole = queryTokens.some((t) => t === 'work' || t === 'currently' || t === 'current');
    const isCurrentRole =
      (chunk.date && chunk.date.includes('present')) || textLower.includes('currently');
    if (asksCurrentRole && isCurrentRole) score += 8;

    // Whole-phrase match is a strong signal
    if (queryLower.length > 5 && textLower.includes(queryLower)) score += 6;

    // Favour tighter chunks (precision over verbosity)
    score = score / (Math.sqrt(textLower.length) / 32);
    return score;
  }

  search(query, maxResults = 5) {
    if (!this.isInitialized) throw new Error('RAGSystem not initialized');
    const queryLower = query.toLowerCase().trim();
    let queryTokens = tokenize(queryLower).filter((t) => !STOPWORDS.has(t));
    // If every word is a stopword (e.g. "Where does Roberto work?"), use them anyway
    if (queryTokens.length === 0) queryTokens = tokenize(queryLower);
    if (queryTokens.length === 0) return [];

    return this.chunks
      .map((chunk) => ({ chunk, score: this.scoreChunk(queryTokens, queryLower, chunk) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  /**
   * Build the grounded prompt context for a user question.
   * Chunks and total length are capped so tiny models can attend to all of it.
   * @returns {{ context: string, sources: string[], grounded: boolean }}
   */
  buildContext(query, maxChunks = 3) {
    const results = this.search(query, maxChunks + 2);
    const grounded = results.length > 0 && results[0].score >= 1.8;

    const used = results.filter((r) => r.score >= 0.8).slice(0, maxChunks);
    const CHUNK_CAP = 420;
    const TOTAL_CAP = 1500;

    let context = '';
    let index = 1;
    for (const r of used) {
      const piece = r.chunk.text.length > CHUNK_CAP ? r.chunk.text.slice(0, CHUNK_CAP) + '…' : r.chunk.text;
      const entry = `[${index}] ${piece}`;
      context = context ? `${context}\n\n${entry}` : entry;
      if (context.length > TOTAL_CAP) break;
      index += 1;
    }

    const sources = used.map((r) => r.chunk.label);
    return { context, sources, grounded };
  }

  // ---------- Compat helpers (used by utils/testRAG.js) ----------

  getStats() {
    return {
      isInitialized: this.isInitialized,
      totalChunks: this.chunks.length,
      chunkKinds: this.chunks.reduce((acc, chunk) => {
        acc[chunk.kind] = (acc[chunk.kind] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async testSearch(query) {
    if (!this.isInitialized) await this.initialize();
    return this.search(query, 3);
  }

  async generateContext(query) {
    if (!this.isInitialized) await this.initialize();
    const { context, grounded } = this.buildContext(query);
    return grounded
      ? `CV facts:\n\n${context}\n\nAnswer using only the facts above.`
      : 'No CV facts found for this query. Say the question is outside the CV.';
  }
}

// ---------- helpers ----------

function stripFormattingMarkers(text) {
  return String(text)
    .replace(/<</g, '')
    .replace(/>>/g, '');
}

function cleanText(text) {
  return stripFormattingMarkers(text)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[•➢→]/g, '- ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9][a-z0-9+#.']*/g) || []
  ).filter((t) => t.length > 2);
}

/**
 * Word-prefix token match: "work" matches "worked"/"working" but not "upwork".
 * Avoids substring false positives across word boundaries.
 */
function containsToken(text, token) {
  return new RegExp(`\\b${escapeRegExp(token)}`).test(text);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const ragSystem = new RAGSystem();
export { RAGSystem };
