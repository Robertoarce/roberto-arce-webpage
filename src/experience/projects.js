import fetchRepositoriesData from '../data/repositories.js';

// Resolve screenshot asset URLs at build time (hashed + production-safe).
const shotModules = import.meta.glob('../assets/screenshots/*.{png,jpg,jpeg}', { eager: true });

function resolveShot(name) {
  if (!name) return null;
  const key = Object.keys(shotModules).find(
    (k) => k.endsWith('/' + name) || k.endsWith('\\' + name)
  );
  return key ? shotModules[key].default : null;
}

// Strip HTML from the v-html repo descriptions into plain text.
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// Loose, non-fabricated category hint derived from the project's own stack.
function categoryFor(repo) {
  const s = `${repo.title} ${(repo.technologies || []).join(' ')}`.toLowerCase();
  if (/(llm|gpt|gemini|claude|anthropic|openai|nlp|rag|chatbot|characters|browser.use)/.test(s)) return 'Generative AI';
  if (/(pipeline|dbt|docker|etl|sql|warehouse|scraper|scraping|jinja|edge functions)/.test(s)) return 'Data Engineering';
  if (/(churn|classification|regression|density|benchmark|eda|scikit|xgboost|lightgbm)/.test(s)) return 'Machine Learning';
  return 'Data / ML';
}

// Marker so it's obvious where real, per-project info should be filled in.
const PLACEHOLDER_ROLE = 'Role — add in src/experience/projects.js';

/**
 * Normalise real repository data into mosaic "tiles".
 * Returns a Promise so the experience can show a skeleton while loading.
 */
export default async function loadProjects() {
  const repos = await fetchRepositoriesData();
  return repos
    .filter((r) => r.in_startpage)
    .map((r, i) => {
      const plain = stripHtml(r.description);
      return {
        id: `p-${i}`,
        number: String(i + 1).padStart(2, '0'),
        title: r.title,
        summary: plain.length > 150 ? `${plain.slice(0, 150).trimEnd()}…` : plain,
        description: plain,
        technologies: r.technologies || [],
        category: categoryFor(r),
        role: PLACEHOLDER_ROLE,
        git_link: r.git_link || '',
        notebook_url: r.notebook_url || '',
        ongoing: !!r.ongoing,
        image: r.images && r.images.length ? resolveShot(r.images[0]) : null,
      };
    });
}
