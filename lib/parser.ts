import Parser from 'rss-parser';
import { createHash } from 'crypto';
import { Article, FeedConfig, SourceSummary } from '@/types/article';
import { FEEDS } from './feeds';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Regulatory-News-Aggregator/1.0',
  },
});

function generateId(url: string): string {
  return createHash('sha256').update(url).digest('hex').substring(0, 32);
}

function extractTags(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const keywords = [
    'drug approval', 'drug recall', 'generic drug', 'biosimilar',
    'safety alert', 'medwatch', 'adverse event', 'risk communication',
    'vaccine', 'biologics', 'clinical trial', 'orphan drug',
    'guidance document', 'regulatory submission', '510(k)', 'nda', 'bla',
    'outbreak', 'pandemic', 'food safety', 'labeling',
    'fda', 'mhra', 'health canada', 'cdc', 'nih',
    'recall', 'warning', 'alert', 'approval', 'clearance',
  ];

  return keywords.filter((keyword) => text.includes(keyword));
}

function normalizeSummary(content: string | undefined, description: string | undefined): string {
  const raw = content || description || '';
  // Strip HTML tags
  const text = raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.substring(0, 300);
}

async function fetchFeed(feed: FeedConfig): Promise<{ articles: Article[]; success: boolean }> {
  try {
    const feedData = await parser.parseURL(feed.url);
    const articles: Article[] = (feedData.items || []).map((item) => {
      const link = item.link || item.guid || '';
      const title = item.title || 'Untitled';
      const publishedAt = item.pubDate || item.isoDate || new Date().toISOString();
      const summary = normalizeSummary(item.content, item.contentSnippet);

      return {
        id: generateId(link),
        title,
        summary,
        link,
        publishedAt: new Date(publishedAt).toISOString(),
        source: feed.source,
        country: feed.country,
        agency: feed.agency,
        tags: extractTags(title, summary),
      };
    });

    return { articles, success: true };
  } catch (error) {
    console.error(`Failed to fetch ${feed.source}:`, error);
    return { articles: [], success: false };
  }
}

export async function fetchAllFeeds(): Promise<{ articles: Article[]; sources: SourceSummary[] }> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const articles: Article[] = [];
  const sources: SourceSummary[] = [];

  results.forEach((result, index) => {
    const feed = FEEDS[index];
    if (result.status === 'fulfilled') {
      articles.push(...result.value.articles);
      sources.push({
        name: feed.source,
        country: feed.country,
        count: result.value.articles.length,
        success: result.value.success,
      });
    } else {
      sources.push({
        name: feed.source,
        country: feed.country,
        count: 0,
        success: false,
      });
    }
  });

  // Deduplicate by link
  const seen = new Set<string>();
  const unique = articles.filter((article) => {
    if (seen.has(article.link)) return false;
    seen.add(article.link);
    return true;
  });

  // Sort by date descending
  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return { articles: unique, sources };
}