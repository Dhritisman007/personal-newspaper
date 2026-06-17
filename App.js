/* global React, ReactDOM */

const { useState, useEffect, useCallback, useMemo, useRef, Component } = React;

// ─── Configuration ───────────────────────────────────────────────────────────

const RSS_FEEDS = [
  {
    id: 'indian-express',
    name: 'Indian Express',
    url: 'https://indianexpress.com/feed/',
  },
  {
    id: 'economic-times',
    name: 'Economic Times',
    url: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms',
  },
  {
    id: 'the-print',
    name: 'The Print',
    url: 'https://news.google.com/rss/search?q=site:theprint.in&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    id: 'the-wire',
    name: 'The Wire',
    url: 'https://news.google.com/rss/search?q=site:thewire.in&hl=en-IN&gl=IN&ceid=IN:en',
  },
  {
    id: 'the-hindu',
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/national/?service=rss',
  },
  {
    id: 'assam-tribune',
    name: 'Assam Tribune',
    url: 'https://assamtribune.com/feed/',
  },
  {
    id: 'fifa-world-cup',
    name: 'FIFA World Cup',
    url: 'https://news.google.com/rss/search?q=FIFA+World+Cup&hl=en-IN&gl=IN&ceid=IN:en',
  },
];

const TOPICS = [
  'Govt Policies',
  'Business',
  'Geopolitics',
  'Financial Markets',
  'Macroeconomics',
  'India Markets',
  'FIFA World Cup',
  'General News',
];

const TOPIC_KEYWORDS = {
  'Govt Policies': [
    'policy', 'policies', 'government', 'govt', 'parliament', 'ministry', 'cabinet',
    'legislation', 'bill', 'ordinance', 'regulation', 'bureaucracy', 'modi', 'bjp',
    'congress', 'election', 'budget', 'subsidy', 'scheme', 'yojana', 'gst reform',
    'tax reform', 'licensing', 'privatisation', 'privatization', 'reform bill',
  ],
  Business: [
    'business', 'corporate', 'company', 'companies', 'startup', 'start-up', 'merger',
    'acquisition', 'ipo', 'earnings', 'profit', 'revenue', 'ceo', 'industry',
    'manufacturing', 'retail', 'e-commerce', 'ecommerce', 'unicorn', 'venture',
    'private equity', 'deal', 'stake', 'investment', 'adani', 'reliance', 'tata',
  ],
  Geopolitics: [
    'geopolit', 'diplomacy', 'diplomatic', 'foreign policy', 'war', 'conflict',
    'nato', 'un security', 'china', 'pakistan', 'russia', 'ukraine', 'israel',
    'gaza', 'middle east', 'taiwan', 'border', 'sanctions', 'treaty', 'summit',
    'bilateral', 'multilateral', 'embassy', 'tariff war', 'trade war',
  ],
  'Financial Markets': [
    'stock', 'stocks', 'equity', 'equities', 'market', 'markets', 'nifty', 'sensex',
    'dow', 'nasdaq', 's&p', 's&p 500', 'wall street', 'trading', 'investor',
    'bull', 'bear', 'rally', 'selloff', 'sell-off', 'ipo', 'fii', 'dii', 'futures',
    'options', 'derivatives', 'bond yield', 'treasury', 'fed', 'rbi rate',
  ],
  Macroeconomics: [
    'gdp', 'inflation', 'cpi', 'wpi', 'interest rate', 'monetary', 'fiscal',
    'deficit', 'trade deficit', 'current account', 'forex', 'rupee', 'dollar',
    'central bank', 'rbi', 'fed', 'ecb', 'recession', 'growth', 'unemployment',
    'pmi', 'manufacturing index', 'macro', 'economic growth', 'stimulus',
  ],
  'India Markets': [
    'india market', 'indian market', 'bse', 'nse', 'nifty', 'sensex', 'rupee',
    'rbi', 'sebi', 'indian stocks', 'mumbai', 'dalal street', 'fii flows',
    'dii', 'india gdp', 'indian economy', 'india inflation', 'india growth',
  ],
  'FIFA World Cup': [
    'fifa', 'world cup', 'worldcup', 'football', 'soccer', 'messi', 'ronaldo', 'mbappe',
    'qatar', 'conmebol', 'uefa', 'lionel messi', 'cristiano ronaldo', 'world cup 2026', 
    'world cup 2030', 'fifa world cup qualification', 'qualification cycle', 'qualifying campaign', 
    'qualifying round', 'qualifying group', 'host bid', 'host selection', 'host cities', 
    'joint bid', 'tournament expansion', '48 team format', '32 team format', 'group draw', 
    'draw pots', 'seeded team', 'unseeded team', 'knockout bracket', 'group standings', 
    'goal difference', 'advancement scenarios', 'qualification scenario', 'automatic qualification', 
    'playoff berth', 'inter confederation playoff', 'continental playoff', 'elimination scenario', 
    'third place match', 'opening match', 'opening ceremony', 'closing ceremony', 'world cup trophy', 
    'golden boot', 'golden ball', 'golden glove', 'young player award', 'fair play award', 
    'fifa fan festival', 'official match ball', 'official mascot', 'fifa ranking', 'fifa points', 
    'fifa coefficient', 'ranking based seeding', 'draw procedure', 'tournament regulations', 
    'disciplinary record', 'fair play points', 'suspension accumulation', 'yellow card accumulation', 
    'knockout progression', 'group winner', 'group runner up', 'best third placed team', 
    'qualification path', 'expected goals', 'xg', 'xga', 'non penalty xg', 'possession percentage', 
    'passing accuracy', 'shot conversion rate', 'goal conversion rate', 'clean sheet percentage', 
    'group stage performance', 'knockout stage performance', 'tournament win probability', 
    'title odds', 'advancement probability', 'qualification probability', 'elo rating', 
    'team strength index', 'host nation', 'qualified nation', 'eliminated nation', 
    'defending champion', 'reigning champion', 'world cup debutant', 'tournament favorite', 
    'dark horse', 'title contender', 'qualified team', 'eliminated team'
  ],
};

const MARKET_INDICES = [
  { id: 'nifty', label: 'Nifty 50', symbol: '^NSEI', stooq: '^nsei', currency: 'INR' },
  { id: 'sensex', label: 'Sensex', symbol: '^BSESN', stooq: '^bsns', currency: 'INR' },
  { id: 'nasdaq', label: 'Nasdaq', symbol: '^IXIC', stooq: '^ndq', currency: 'USD' },
  { id: 'sp500', label: 'S&P 500', symbol: '^GSPC', stooq: '^spx', currency: 'USD' },
];

const COMMODITIES = [
  { id: 'gold', label: 'Gold', symbol: 'GC=F', stooq: 'xauusd', currency: 'USD' },
  { id: 'silver', label: 'Silver', symbol: 'SI=F', stooq: 'xagusd', currency: 'USD' },
  { id: 'oil', label: 'Crude Oil', symbol: 'CL=F', stooq: 'cl.f', currency: 'USD' },
];

const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CORS_PROXIES = IS_LOCAL ? [
  (url) => `/proxy?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
] : [
  (url) => `/api/proxy?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const CURRENCY_PAIRS = [
  { id: 'usd-inr', label: 'USD/INR', from: 'USD' },
  { id: 'eur-inr', label: 'EUR/INR', from: 'EUR' },
  { id: 'gbp-inr', label: 'GBP/INR', from: 'GBP' },
];

const POSITIVE_WORDS = [
  'growth', 'surge', 'rally', 'gain', 'profit', 'boost', 'rise', 'jump', 'soar',
  'win', 'success', 'record', 'upgrade', 'strong', 'positive', 'improve', 'recovery',
  'boom', 'optimism', 'breakthrough', 'innovation', 'progress', 'achieve', 'celebrate',
  'thrive', 'empower', 'prosper', 'advance', 'benefit', 'robust', 'upbeat', 'buoyant',
  'bullish', 'outperform', 'milestone', 'hike', 'approval', 'acquit', 'peace', 'deal',
];

const NEGATIVE_WORDS = [
  'crash', 'fall', 'drop', 'loss', 'decline', 'slump', 'plunge', 'crisis', 'fear',
  'risk', 'threat', 'war', 'kill', 'death', 'attack', 'terror', 'fraud', 'scam',
  'corruption', 'recession', 'inflation', 'deficit', 'debt', 'ban', 'arrest', 'protest',
  'violence', 'disaster', 'collapse', 'fail', 'worst', 'negative', 'concern', 'tension',
  'scandal', 'downturn', 'bearish', 'bloodbath', 'selloff', 'downgrade', 'layoff',
  'default', 'slash', 'bomb', 'earthquake', 'flood', 'drought', 'pandemic', 'casualty',
];

const SKELETON_COUNT = 9;

// Loaded from config.local.js when present; bundled so hosting works with zero setup
const NEWSAPI_KEY =
  (typeof window !== 'undefined' && window.CHRONICLE_NEWSAPI_KEY) ||
  '946375bae9cd461f9da06a74d6ede037';

// ─── Utilities ───────────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function truncate(text, max = 200) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatRelative(date) {
  if (!date) return 'Recently';
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

function formatUpdated(date) {
  if (!date) return '—';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateId() {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function unwrapProxyResponse(text) {
  const trimmed = text?.trim() || '';
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return text;
  try {
    const json = JSON.parse(trimmed);
    if (typeof json.contents === 'string') return json.contents;
    if (typeof json.data === 'string') return json.data;
    if (json.status?.http_code === 200 && json.contents) return json.contents;
  } catch {
    /* plain text */
  }
  return text;
}

async function fetchWithProxies(url, options = {}) {
  let lastError;
  for (const buildProxy of CORS_PROXIES) {
    try {
      const proxyUrl = buildProxy(url);
      
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      if (options.signal) {
        options.signal.addEventListener('abort', onAbort);
      }
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      let res;
      try {
        res = await fetch(proxyUrl, {
          ...options,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
        if (options.signal) {
          options.signal.removeEventListener('abort', onAbort);
        }
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      const text = unwrapProxyResponse(raw);
      if (!text || text.length < 10) throw new Error('Empty response');
      if (text.includes('error code:') || text.includes('Moved Permanently')) {
        throw new Error('Proxy error page');
      }
      return text;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All proxies failed');
}

function tagArticle(title, description) {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const matched = [];
  for (const topic of TOPICS) {
    if (topic === 'General News') continue;
    const keywords = TOPIC_KEYWORDS[topic] || [];
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      matched.push(topic);
    }
  }
  return matched.length > 0 ? matched : ['General News'];
}

function analyzeSentiment(title, description) {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const words = text.split(/\W+/);
  let score = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.includes(w)) score++;
    if (NEGATIVE_WORDS.includes(w)) score--;
  }
  if (score >= 2) return 'positive';
  if (score <= -2) return 'negative';
  return 'neutral';
}

function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('chronicle-bookmarks') || '[]');
  } catch {
    return [];
  }
}

function saveBookmarksToStorage(bookmarks) {
  localStorage.setItem('chronicle-bookmarks', JSON.stringify(bookmarks));
}

function getWeatherEmoji(desc) {
  const d = (desc || '').toLowerCase();
  if (d.includes('clear') || d.includes('sunny')) return '☀️';
  if (d.includes('partly')) return '⛅';
  if (d.includes('cloud') || d.includes('overcast')) return '☁️';
  if (d.includes('rain') || d.includes('drizzle') || d.includes('shower')) return '🌧️';
  if (d.includes('thunder') || d.includes('storm')) return '⛈️';
  if (d.includes('snow') || d.includes('sleet')) return '🌨️';
  if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return '🌫️';
  return '🌤️';
}

function formatCricketInnings(teamScore) {
  if (!teamScore) return '';
  const parts = [];
  if (teamScore.inngs1) {
    let s = `${teamScore.inngs1.runs}/${teamScore.inngs1.wickets}`;
    if (teamScore.inngs1.overs) s += ` (${teamScore.inngs1.overs})`;
    parts.push(s);
  }
  if (teamScore.inngs2) {
    let s = `${teamScore.inngs2.runs}/${teamScore.inngs2.wickets}`;
    if (teamScore.inngs2.overs) s += ` (${teamScore.inngs2.overs})`;
    parts.push(s);
  }
  return parts.join(' & ');
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

function getContentEncoded(node) {
  for (const child of node.children || []) {
    if (child.nodeName === 'content:encoded' || child.localName === 'encoded') {
      return child.textContent;
    }
  }
  return null;
}

function parseRssXml(xml, sourceName) {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) return [];

  const items = doc.querySelectorAll('item');
  const entries = doc.querySelectorAll('entry');
  const nodes = items.length ? items : entries;

  return Array.from(nodes).map((node) => {
    const title =
      node.querySelector('title')?.textContent?.trim() ||
      node.getElementsByTagNameNS?.('*', 'title')?.[0]?.textContent?.trim() ||
      '';
    const linkEl = node.querySelector('link');
    let link =
      node.querySelector('link')?.textContent?.trim() ||
      node.querySelector('guid')?.textContent?.trim() ||
      '';
    if (linkEl?.getAttribute('href')) link = linkEl.getAttribute('href');
    if (!link && linkEl) {
      const alt = node.querySelector('link[rel="alternate"]');
      if (alt?.getAttribute('href')) link = alt.getAttribute('href');
    }
    const rawBody =
      node.querySelector('description')?.textContent ||
      getContentEncoded(node) ||
      node.querySelector('summary')?.textContent ||
      node.getElementsByTagNameNS?.('*', 'summary')?.[0]?.textContent ||
      node.querySelector('content')?.textContent ||
      '';
    const description = stripHtml(rawBody) || title;
    const pubDate =
      node.querySelector('pubDate')?.textContent ||
      node.querySelector('published')?.textContent ||
      node.querySelector('updated')?.textContent ||
      '';
    const parsedDate = parseDate(pubDate);
    const topics = tagArticle(title, description);

    return {
      id: generateId(),
      title,
      link,
      description: truncate(description, 220),
      pubDate: parsedDate,
      source: sourceName,
      topics,
    };
  }).filter((a) => a.title && a.link);
}

async function fetchRssFeed(feed, signal) {
  const xml = await fetchWithProxies(feed.url, { signal });
  return parseRssXml(xml, feed.name);
}

async function fetchNewsApiFallback(apiKey, signal) {
  if (!apiKey?.trim()) return [];
  const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=30&apiKey=${encodeURIComponent(apiKey.trim())}`;
  let data;
  try {
    const body = await fetchWithProxies(url, { signal });
    data = JSON.parse(body);
  } catch {
    return [];
  }
  if (data?.status === 'error' || !data?.articles?.length) return [];

  return data.articles.map((a) => {
    const description = stripHtml(a.description || a.content || '') || a.title;
    const topics = tagArticle(a.title, description);
    return {
      id: generateId(),
      title: a.title || '',
      link: a.url || '#',
      description: truncate(description, 220),
      pubDate: parseDate(a.publishedAt),
      source: a.source?.name || 'NewsAPI',
      topics,
    };
  }).filter((a) => a.title);
}

function parseYahooChartMeta(meta, currency) {
  if (!meta) return null;
  const price = meta.regularMarketPrice ?? meta.previousClose;
  if (price == null || Number.isNaN(price)) return null;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;
  return {
    price,
    change,
    changePct,
    currency: meta.currency || currency,
  };
}

function parseStooqCsv(csv, currency) {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const cols = lines[1].split(',');
  if (cols.length < 7 || cols[1] === 'B/D' || cols[6] === 'B/D') return null;
  const close = parseFloat(cols[6]);
  const prev = parseFloat(cols[3]); // Use Open price as baseline for today's change
  if (Number.isNaN(close) || Number.isNaN(prev) || prev === 0) return null;
  const change = close - prev;
  const changePct = (change / prev) * 100;
  return { price: close, change, changePct, currency };
}

async function fetchYahooChartQuote(index, signal) {
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(index.symbol)}?interval=1d&range=1d`;
  const body = await fetchWithProxies(chartUrl, { signal });
  const json = JSON.parse(body);
  const meta = json?.chart?.result?.[0]?.meta;
  return parseYahooChartMeta(meta, index.currency);
}

async function fetchStooqQuote(index, signal) {
  const stooqUrl = `https://stooq.pl/q/l/?s=${encodeURIComponent(index.stooq)}&f=sd2t2ohlcvp&h&e=csv`;
  const csv = await fetchWithProxies(stooqUrl, { signal });
  return parseStooqCsv(csv, index.currency);
}

async function fetchIndexQuote(index, signal) {
  try {
    const yahoo = await fetchYahooChartQuote(index, signal);
    if (yahoo) return yahoo;
  } catch {
    /* fall through */
  }
  try {
    return await fetchStooqQuote(index, signal);
  } catch {
    return null;
  }
}

async function fetchAllMarketQuotes(signal) {
  const allIndices = [...MARKET_INDICES, ...COMMODITIES];
  const entries = await Promise.all(
    allIndices.map(async (index) => {
      const quote = await fetchIndexQuote(index, signal);
      return [index.id, quote];
    })
  );
  return Object.fromEntries(entries);
}

async function fetchWeatherData(signal) {
  try {
    const url = 'https://wttr.in/Guwahati?format=j1';
    const body = await fetchWithProxies(url, { signal });
    const data = JSON.parse(body);
    const current = data.current_condition?.[0] || {};
    const area = data.nearest_area?.[0] || {};
    return {
      temp: parseInt(current.temp_C || '0', 10),
      feelsLike: parseInt(current.FeelsLikeC || '0', 10),
      desc: current.weatherDesc?.[0]?.value || 'Unknown',
      humidity: current.humidity || '',
      windKmph: current.windspeedKmph || '',
      city: area.areaName?.[0]?.value || 'Unknown',
      icon: getWeatherEmoji(current.weatherDesc?.[0]?.value || ''),
    };
  } catch {
    return null;
  }
}

async function fetchCricketScores(signal) {
  try {
    const url = 'https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en';
    const body = await fetchWithProxies(url, { signal });
    const data = JSON.parse(body);
    const matches = [];
    for (const typeMatch of (data.typeMatches || [])) {
      for (const seriesMatch of (typeMatch.seriesMatches || [])) {
        const wrapper = seriesMatch.seriesAdWrapper || seriesMatch;
        for (const match of (wrapper.matches || [])) {
          const info = match.matchInfo || {};
          const score = match.matchScore || {};
          matches.push({
            id: info.matchId || `m-${matches.length}`,
            desc: info.matchDesc || '',
            series: info.seriesName || '',
            status: info.status || '',
            state: info.state || '',
            team1: {
              name: info.team1?.teamSName || info.team1?.teamName || '?',
              score: formatCricketInnings(score.team1Score),
            },
            team2: {
              name: info.team2?.teamSName || info.team2?.teamName || '?',
              score: formatCricketInnings(score.team2Score),
            },
          });
        }
      }
    }
    return matches.slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchCurrencyRates(signal) {
  try {
    const url = 'https://open.er-api.com/v6/latest/USD';
    const body = await fetchWithProxies(url, { signal });
    const data = JSON.parse(body);
    if (data.result !== 'success') return null;
    return data.rates;
  } catch {
    return null;
  }
}

// ─── Error Boundary ──────────────────────────────────────────────────────────

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Chronicle ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-md text-center border border-neutral-800 p-8">
            <h1 className="font-serif text-2xl text-white mb-3">Something went wrong</h1>
            <p className="text-neutral-400 text-sm mb-6 font-sans">
              The news desk encountered an unexpected error. Please reload the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2 border border-neutral-600 text-neutral-200 hover:bg-neutral-900 font-sans text-sm transition-colors"
            >
              Reload Chronicle
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── UI Components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <article className="border border-neutral-800 p-5 flex flex-col gap-3">
      <div className="h-3 w-20 skeleton-shimmer rounded-sm" />
      <div className="h-6 w-full skeleton-shimmer rounded-sm" />
      <div className="h-6 w-4/5 skeleton-shimmer rounded-sm" />
      <div className="h-3 w-full skeleton-shimmer rounded-sm" />
      <div className="h-3 w-full skeleton-shimmer rounded-sm" />
      <div className="h-3 w-2/3 skeleton-shimmer rounded-sm" />
      <div className="h-8 w-24 skeleton-shimmer rounded-sm mt-2" />
    </article>
  );
}

function MarketTickerItem({ index, quote, loading }) {
  const positive = (quote?.changePct ?? 0) >= 0;
  const colorClass = positive ? 'text-emerald-400' : 'text-red-400';

  const formatPrice = (price, currency) => {
    if (price == null || Number.isNaN(price)) return '—';
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return price.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-sans text-xs sm:text-sm shrink-0">
      <span className="text-neutral-500 uppercase tracking-wider">{index.label}</span>
      {loading ? (
        <span className="text-neutral-600 animate-pulse">loading…</span>
      ) : !quote ? (
        <span className="text-neutral-600">—</span>
      ) : (
        <>
          <span className="text-neutral-200 font-medium tabular-nums">
            {formatPrice(quote.price, quote.currency)}
          </span>
          <span className={`tabular-nums ${colorClass}`}>
            {quote.changePct >= 0 ? '+' : ''}
            {Number(quote.changePct).toFixed(2)}%
          </span>
        </>
      )}
      <span className="text-neutral-700 mx-3">|</span>
    </span>
  );
}

function CurrencyTickerItem({ pair, rates, loading }) {
  const rate = rates
    ? pair.from === 'USD'
      ? rates.INR
      : rates.INR && rates[pair.from]
        ? rates.INR / rates[pair.from]
        : null
    : null;

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-sans text-xs sm:text-sm shrink-0">
      <span className="text-amber-600/80 uppercase tracking-wider">{pair.label}</span>
      {loading ? (
        <span className="text-neutral-600 animate-pulse">loading…</span>
      ) : rate == null ? (
        <span className="text-neutral-600">—</span>
      ) : (
        <span className="text-neutral-200 font-medium tabular-nums">
          ₹{rate.toFixed(2)}
        </span>
      )}
      <span className="text-neutral-700 mx-3">|</span>
    </span>
  );
}

function TickerBar({ quotes, loading, currencyRates, currencyLoading }) {
  const marketItems = MARKET_INDICES.map((idx) => (
    <MarketTickerItem
      key={idx.id}
      index={idx}
      quote={quotes[idx.id]}
      loading={loading}
    />
  ));

  const currencyItems = CURRENCY_PAIRS.map((pair) => (
    <CurrencyTickerItem
      key={pair.id}
      pair={pair}
      rates={currencyRates}
      loading={currencyLoading}
    />
  ));

  return (
    <div className="sticky top-0 z-50 bg-neutral-950 border-b border-neutral-800">
      <div className="flex items-center h-10 px-3 sm:px-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans mr-4 shrink-0">
          Markets
        </span>
        <div className="flex items-center shrink-0">
          {marketItems}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans mx-3 shrink-0">
          Forex
        </span>
        <div className="flex items-center shrink-0">
          {currencyItems}
        </div>
      </div>
    </div>
  );
}

function CommoditiesWidget({ quotes, loading }) {
  return (
    <div className="flex items-center gap-3 bg-neutral-900/30 border border-neutral-800/60 px-3 py-1.5 rounded-sm font-sans text-xs w-full sm:w-auto overflow-x-auto hide-scroll">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold shrink-0">
        Commodities
      </span>
      <div className="flex items-center gap-3 shrink-0">
        {COMMODITIES.map((idx) => {
          const quote = quotes[idx.id];
          const positive = (quote?.changePct ?? 0) >= 0;
          const colorClass = positive ? 'text-emerald-400' : 'text-red-400';
          return (
            <span key={idx.id} className="inline-flex items-center gap-1.5 shrink-0">
              <span className="text-amber-600/80 uppercase tracking-wider">{idx.label}</span>
              {loading ? (
                <span className="text-neutral-600 animate-pulse">loading…</span>
              ) : !quote ? (
                <span className="text-neutral-600">—</span>
              ) : (
                <>
                  <span className="text-neutral-200 font-medium tabular-nums">
                    {quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`tabular-nums ${colorClass}`}>
                    {quote.changePct >= 0 ? '+' : ''}{Number(quote.changePct).toFixed(2)}%
                  </span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TopicTag({ topic }) {
  const colors = {
    'Govt Policies': 'border-amber-900/60 text-amber-200/90',
    Business: 'border-blue-900/60 text-blue-200/90',
    Geopolitics: 'border-purple-900/60 text-purple-200/90',
    'Financial Markets': 'border-emerald-900/60 text-emerald-200/90',
    Macroeconomics: 'border-cyan-900/60 text-cyan-200/90',
    'India Markets': 'border-orange-900/60 text-orange-200/90',
    'FIFA World Cup': 'border-pink-900/60 text-pink-200/90',
    'General News': 'border-neutral-700 text-neutral-400',
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 border font-sans ${colors[topic] || colors['General News']}`}
    >
      {topic}
    </span>
  );
}

function SentimentBadge({ sentiment }) {
  const config = {
    positive: { color: 'bg-emerald-500', label: 'Positive', glow: 'shadow-emerald-500/30' },
    negative: { color: 'bg-red-500', label: 'Negative', glow: 'shadow-red-500/30' },
    neutral: { color: 'bg-neutral-600', label: 'Neutral', glow: '' },
  };
  const { color, label, glow } = config[sentiment] || config.neutral;
  return (
    <span
      title={`Sentiment: ${label}`}
      className={`inline-block w-2 h-2 rounded-full ${color} ${glow} shadow-sm shrink-0`}
    />
  );
}

function BookmarkButton({ article, bookmarks, onToggle }) {
  const saved = bookmarks.some((b) => b.link === article.link);
  const [popping, setPopping] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopping(true);
    setTimeout(() => setPopping(false), 300);
    onToggle(article);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`transition-colors ${popping ? 'bookmark-pop' : ''} ${
        saved
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-neutral-600 hover:text-neutral-300'
      }`}
      title={saved ? 'Remove bookmark' : 'Save for later'}
    >
      <svg
        className="w-4 h-4"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}

function ArticleCard({ article, bookmarks, onToggleBookmark }) {
  const sentiment = useMemo(
    () => analyzeSentiment(article.title, article.description),
    [article.title, article.description]
  );

  return (
    <article className="group border border-neutral-800 bg-neutral-950/50 hover:border-neutral-600 transition-colors p-5 flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-sans border border-neutral-800 px-2 py-0.5">
          {article.source}
        </span>
        {article.topics.slice(0, 2).map((t) => (
          <TopicTag key={t} topic={t} />
        ))}
        {article.topics.length > 2 && (
          <span className="text-[10px] text-neutral-600 font-sans">+{article.topics.length - 2}</span>
        )}
        <div className="ml-auto flex items-center gap-2.5">
          <SentimentBadge sentiment={sentiment} />
          <BookmarkButton
            article={article}
            bookmarks={bookmarks}
            onToggle={onToggleBookmark}
          />
        </div>
      </div>
      <h2 className="font-serif text-lg leading-snug text-neutral-100 group-hover:text-white mb-2 line-clamp-3">
        {article.title}
      </h2>
      <p className="text-neutral-500 text-sm font-sans leading-relaxed flex-1 line-clamp-4 mb-4">
        {article.description}
      </p>
      <footer className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-800/80">
        <time className="text-[11px] text-neutral-600 font-sans tabular-nums">
          {formatRelative(article.pubDate)}
        </time>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-sans uppercase tracking-wider text-neutral-300 hover:text-white border-b border-neutral-600 hover:border-white transition-colors pb-0.5"
        >
          Read Full →
        </a>
      </footer>
    </article>
  );
}

function WeatherWidget({ weather, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 bg-neutral-900/50 rounded-sm">
        <div className="w-16 h-4 skeleton-shimmer rounded-sm" />
      </div>
    );
  }
  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 bg-neutral-900/50 rounded-sm font-sans text-sm">
      <span className="text-lg leading-none">{weather.icon}</span>
      <span className="text-white font-medium tabular-nums">{weather.temp}°C</span>
      <span className="text-neutral-500 text-xs hidden sm:inline">{weather.desc}</span>
      <span className="text-neutral-600 text-xs">·</span>
      <span className="text-neutral-400 text-xs">{weather.city}</span>
    </div>
  );
}

function CricketStrip({ matches, loading }) {
  if (loading) {
    return (
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans shrink-0">🏏 Live</span>
            <div className="w-48 h-4 skeleton-shimmer rounded-sm" />
          </div>
        </div>
      </div>
    );
  }
  if (!matches || matches.length === 0) return null;

  return (
    <div className="border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans shrink-0">
            🏏 Cricket
          </span>
          {matches.map((m) => {
            const isLive = m.state === 'In Progress' || m.state === 'Live';
            return (
              <div
                key={m.id}
                className={`shrink-0 flex items-center gap-3 px-3 py-1.5 border rounded-sm font-sans text-xs ${
                  isLive
                    ? 'border-emerald-900/60 bg-emerald-950/20'
                    : 'border-neutral-800 bg-neutral-900/30'
                }`}
              >
                {isLive && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-medium w-8">{m.team1.name}</span>
                    <span className="text-neutral-400 tabular-nums">{m.team1.score || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-medium w-8">{m.team2.name}</span>
                    <span className="text-neutral-400 tabular-nums">{m.team2.score || '—'}</span>
                  </div>
                </div>
                {m.status && (
                  <span className="text-[10px] text-neutral-500 max-w-[120px] truncate ml-1">
                    {m.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BreakingNewsBanner({ articles }) {
  const breakingArticles = useMemo(() => {
    const thirtyMinsAgo = Date.now() - 60 * 60 * 1000;
    return articles.filter(
      (a) => a.pubDate && a.pubDate.getTime() > thirtyMinsAgo
    );
  }, [articles]);

  if (breakingArticles.length === 0) return null;

  const doubled = [...breakingArticles, ...breakingArticles];

  return (
    <div className="border-b border-red-950/60 bg-red-950/10 overflow-hidden">
      <div className="flex items-center h-9">
        <span className="shrink-0 px-3 sm:px-4 text-[10px] uppercase tracking-[0.2em] text-red-400 font-sans font-semibold bg-red-950/30 h-full flex items-center border-r border-red-900/30">
          ⚡ Breaking
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex items-center whitespace-nowrap">
            {doubled.map((article, i) => (
              <a
                key={`${article.id}-${i}`}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mx-6 text-sm font-sans text-neutral-300 hover:text-white transition-colors"
              >
                <span className="text-red-500/70 text-xs">{article.source}</span>
                <span>{article.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiSelectPills({ label, options, selected, onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`text-xs font-sans px-2.5 py-1 border transition-colors ${
                active
                  ? 'bg-neutral-200 text-black border-neutral-200'
                  : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-neutral-200'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

function ChronicleApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [marketQuotes, setMarketQuotes] = useState({});
  const [marketLoading, setMarketLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [feedErrors, setFeedErrors] = useState(0);
  const abortRef = useRef(null);

  // New state for features
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [cricketMatches, setCricketMatches] = useState([]);
  const [cricketLoading, setCricketLoading] = useState(true);
  const [currencyRates, setCurrencyRates] = useState(null);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  const sourceOptions = useMemo(
    () => [...new Set(articles.map((a) => a.source))].sort(),
    [articles]
  );

  const loadMarketData = useCallback(async (signal) => {
    setMarketLoading(true);
    try {
      const results = await fetchAllMarketQuotes(signal);
      setMarketQuotes(results);
    } catch {
      setMarketQuotes({});
    }
    setMarketLoading(false);
  }, []);

  const loadFeeds = useCallback(
    async (isRefresh = false) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (isRefresh) setRefreshing(true);
      else {
        setLoading(true);
        setArticles([]);
      }

      let errorCount = 0;

      const fetchAndAdd = async (fetchPromise) => {
        try {
          const items = await fetchPromise;
          if (items && items.length > 0) {
            setArticles((prev) => {
              const seen = new Set();
              const all = [...prev, ...items];
              const deduplicated = all.filter((a) => {
                const key = `${a.title}|${a.link}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
              return deduplicated.sort((a, b) => {
                const ta = a.pubDate?.getTime() ?? 0;
                const tb = b.pubDate?.getTime() ?? 0;
                return tb - ta;
              });
            });
            setLoading(false);
          }
        } catch {
          errorCount += 1;
        }
      };

      const promises = RSS_FEEDS.map((feed) =>
        fetchAndAdd(fetchRssFeed(feed, controller.signal))
      );

      if (NEWSAPI_KEY) {
        promises.push(
          fetchAndAdd(fetchNewsApiFallback(NEWSAPI_KEY, controller.signal))
        );
      }

      await Promise.all(promises);

      setFeedErrors(errorCount);
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
    },
    []
  );

  const loadWeather = useCallback(async (signal) => {
    setWeatherLoading(true);
    const data = await fetchWeatherData(signal);
    setWeather(data);
    setWeatherLoading(false);
  }, []);

  const loadCricket = useCallback(async (signal) => {
    setCricketLoading(true);
    const matches = await fetchCricketScores(signal);
    setCricketMatches(matches);
    setCricketLoading(false);
  }, []);

  const loadCurrency = useCallback(async (signal) => {
    setCurrencyLoading(true);
    const rates = await fetchCurrencyRates(signal);
    setCurrencyRates(rates);
    setCurrencyLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFeeds(false);
    loadMarketData(controller.signal);
    loadWeather(controller.signal);
    loadCricket(controller.signal);
    loadCurrency(controller.signal);

    const marketInterval = setInterval(() => {
      loadMarketData(controller.signal);
      loadCurrency(controller.signal);
    }, 60000);

    const cricketInterval = setInterval(() => {
      loadCricket(controller.signal);
    }, 60000);

    return () => {
      controller.abort();
      clearInterval(marketInterval);
      clearInterval(cricketInterval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [loadFeeds, loadMarketData, loadWeather, loadCricket, loadCurrency]);

  const handleRefresh = () => {
    loadFeeds(true);
    const signal = abortRef.current?.signal;
    loadMarketData(signal);
    loadWeather(signal);
    loadCricket(signal);
    loadCurrency(signal);
  };

  const handleToggleBookmark = useCallback((article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.link === article.link);
      let next;
      if (exists) {
        next = prev.filter((b) => b.link !== article.link);
      } else {
        next = [article, ...prev];
      }
      saveBookmarksToStorage(next);
      return next;
    });
  }, []);

  const filteredArticles = useMemo(() => {
    if (showBookmarks) return bookmarks;

    let list = articles;
    const q = searchQuery.trim().toLowerCase();

    if (selectedSources.length > 0) {
      list = list.filter((a) => selectedSources.includes(a.source));
    }
    if (selectedTopics.length > 0) {
      list = list.filter((a) => a.topics.some((t) => selectedTopics.includes(t)));
    }
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, searchQuery, selectedSources, selectedTopics, showBookmarks, bookmarks]);

  const clearFilters = () => {
    setSelectedSources([]);
    setSelectedTopics([]);
    setSearchQuery('');
    setShowBookmarks(false);
  };

  const hasActiveFilters =
    searchQuery.trim() || selectedSources.length > 0 || selectedTopics.length > 0 || showBookmarks;

  return (
    <div className="min-h-screen bg-black">
      <TickerBar
        quotes={marketQuotes}
        loading={marketLoading}
        currencyRates={currencyRates}
        currencyLoading={currencyLoading}
      />

      <CricketStrip matches={cricketMatches} loading={cricketLoading} />

      {!loading && <BreakingNewsBanner articles={articles} />}

      <header className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-600 font-sans mb-2">
                Personalized Intelligence
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-tight">
                Chronicle
              </h1>
              <p className="text-neutral-500 font-sans text-sm mt-2 max-w-lg">
                Curated headlines from India&apos;s leading publications — policies, markets, and
                the world, in one desk.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto overflow-hidden">
              <CommoditiesWidget quotes={marketQuotes} loading={marketLoading} />
              <div className="flex items-center gap-3">
                <WeatherWidget weather={weather} loading={weatherLoading} />
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 text-sm border border-neutral-600 text-neutral-200 hover:bg-neutral-900 disabled:opacity-50 transition-colors font-sans shrink-0"
                >
                  {refreshing ? 'Refreshing…' : 'Refresh Feed'}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 font-sans mt-4 tabular-nums">
            Last updated: {formatUpdated(lastUpdated)}
            {!loading && feedErrors > 0 && (
              <span className="text-neutral-700 ml-2">
                ({feedErrors} source{feedErrors > 1 ? 's' : ''} unavailable)
              </span>
            )}
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-neutral-800/80 space-y-5">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headlines, summaries, sources, topics…"
            className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 pl-10 text-sm text-neutral-200 font-sans placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MultiSelectPills
            label="Filter by Source"
            options={sourceOptions.length ? sourceOptions : RSS_FEEDS.map((f) => f.name)}
            selected={selectedSources}
            onChange={setSelectedSources}
          />
          <MultiSelectPills
            label="Filter by Topic"
            options={TOPICS}
            selected={selectedTopics}
            onChange={setSelectedTopics}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`text-xs font-sans px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${
              showBookmarks
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-amber-600 hover:text-amber-400'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={showBookmarks ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmarks ({bookmarks.length})
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-sans text-neutral-500 hover:text-neutral-300 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!loading && (
          <p className="text-xs text-neutral-600 font-sans mb-6 uppercase tracking-wider">
            {showBookmarks
              ? `${filteredArticles.length} bookmarked article${filteredArticles.length !== 1 ? 's' : ''}`
              : `${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}${hasActiveFilters ? ' matching filters' : ''}`
            }
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 border border-neutral-800">
            <p className="font-serif text-xl text-neutral-400 mb-2">
              {showBookmarks ? 'No bookmarks yet' : 'No stories found'}
            </p>
            <p className="text-sm text-neutral-600 font-sans">
              {showBookmarks
                ? 'Click the bookmark icon on any article to save it for later.'
                : articles.length === 0
                  ? 'Feeds could not be loaded. Try Refresh or check your connection.'
                  : 'Adjust your search or filters to see more headlines.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id || article.link}
                article={article}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800 mt-12 py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-sans">
          Chronicle · RSS Aggregator · No server required
        </p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ChronicleApp />
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
