import { Article } from '@/types/article';

const SUPABASE_URL = 'https://mnrpltjecfhqtrbaxica.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ISyXKnRtp89eZ7-7rDE7TQ_nhy07fsS';

export interface ArchivedArticle {
  id: string;
  date: string;         // YYYY-MM-DD
  title: string;
  summary: string | null;
  link: string;
  published_at: string;
  source: string | null;
  country: string | null;
  agency: string | null;
  tags: string[] | null;
  created_at: string;
}

// ── Archive: Upsert articles into Supabase ────────────────────────────────────
export async function archiveArticles(articles: Article[]): Promise<{ archived: number; errors: number }> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let archived = 0;
  let errors = 0;

  for (const article of articles) {
    const body = {
      id:          article.id,
      date:        today,
      title:       article.title,
      summary:     article.summary || null,
      link:        article.link,
      published_at: article.publishedAt,
      source:      article.source || null,
      country:     article.country || null,
      agency:      article.agency || null,
      tags:        article.tags || [],
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(body),
      });

      if (res.ok || res.status === 201 || res.status === 409) {
        archived++;
      } else {
        const err = await res.text();
        console.error(`Archive error for ${article.id}:`, err);
        errors++;
      }
    } catch (e) {
      console.error(`Archive fetch error for ${article.id}:`, e);
      errors++;
    }
  }

  return { archived, errors };
}

// ── Archive: Delete articles older than N days ─────────────────────────────────
export async function purgeOldArticles(daysToKeep: number = 30): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?date=lt.${cutoffStr}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) return 0;
    const old = await res.json();
    if (!Array.isArray(old) || old.length === 0) return 0;

    // Delete in batch (Supabase REST delete with ids)
    const ids = old.map((a: { id: string }) => a.id);
    const deleteRes = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?id=in.(${ids.join(',')})`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    return deleteRes.ok ? ids.length : 0;
  } catch {
    return 0;
  }
}

// ── Archive: Read articles from a date range ───────────────────────────────────
export async function getArchivedArticles(
  days: number
): Promise<ArchivedArticle[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?date=gte.${cutoffStr}&select=*&order=published_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept': 'application/json',
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ── Archive: Get all archived dates (for UI display) ──────────────────────────
export async function getArchivedDates(): Promise<string[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=date&order=date.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    // Return unique dates
    return [...new Set(data.map((a: { date: string }) => a.date))];
  } catch {
    return [];
  }
}