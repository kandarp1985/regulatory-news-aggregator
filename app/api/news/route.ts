import { NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/parser';
import { getArchivedArticles } from '@/lib/supabase';
import { NewsApiResponse } from '@/types/article';

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range'); // '7d' | '30d' | null

  // ── Historical query via Supabase ────────────────────────────────────────
  if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 7 : 30;
    try {
      const archived = await getArchivedArticles(days);

      if (archived.length > 0) {
        // Deduplicate by id, sort by published_at desc
        const seen = new Set<string>();
        const articles = archived
          .filter((a) => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
          })
          .map((a) => ({
            id: a.id,
            title: a.title,
            summary: a.summary || '',
            link: a.link,
            publishedAt: a.published_at,
            source: a.source || '',
            country: (a.country || 'US') as 'US' | 'UK' | 'CA',
            agency: a.agency || '',
            tags: a.tags || [],
          }))
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );

        const response: NewsApiResponse = {
          articles,
          fetchedAt: new Date().toISOString(),
          sources: [],
        };
        return NextResponse.json(response);
      }

      // No archived data — fall through to live feeds
    } catch (err) {
      console.error('Supabase archive query failed, falling back to live:', err);
      // Fall through to live feeds
    }
  }

  // ── Live feeds (default: today) ──────────────────────────────────────────
  try {
    const { articles, sources } = await fetchAllFeeds();

    const response: NewsApiResponse = {
      articles,
      fetchedAt: new Date().toISOString(),
      sources,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feeds', articles: [], fetchedAt: new Date().toISOString(), sources: [] },
      { status: 500 }
    );
  }
}