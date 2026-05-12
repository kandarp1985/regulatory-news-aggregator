export interface Article {
  id: string;           // SHA-256 hash of the article URL (for stable identity)
  title: string;        // Article title
  summary: string;      // First 300 characters of description/content
  link: string;         // Original article URL
  publishedAt: string;  // ISO 8601 date string
  source: string;       // Human-readable source name e.g. "FDA Press Announcements"
  country: 'US' | 'UK' | 'CA';  // Country tag
  agency: string;       // e.g. "FDA", "MHRA", "Health Canada"
  tags: string[];       // Extracted keyword tags
}

export interface SourceSummary {
  name: string;
  country: string;
  count: number;
  success: boolean;
}

export interface NewsApiResponse {
  articles: Article[];
  fetchedAt: string;
  sources: SourceSummary[];
}

export interface FeedConfig {
  url: string;
  source: string;
  agency: string;
  country: 'US' | 'UK' | 'CA';
}