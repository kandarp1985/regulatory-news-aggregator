import { NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/parser';
import { archiveArticles, purgeOldArticles, getArchivedArticles } from '@/lib/supabase';

const EXPECTED_SECRET = process.env.ARCHIVE_SECRET || 'archive_secret_2026';

// POST /api/archive — called by Hermes cron job
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${EXPECTED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch today's feeds
    const { articles } = await fetchAllFeeds();

    // 2. Archive to Supabase
    const { archived, errors } = await archiveArticles(articles);

    // 3. Purge anything older than 30 days
    const purged = await purgeOldArticles(30);

    return NextResponse.json({
      success: true,
      archived,
      errors,
      purged,
      totalFetched: articles.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Archive error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET /api/archive — preview what would be archived (for debugging)
export async function GET() {
  try {
    const last7Days = await getArchivedArticles(7);
    return NextResponse.json({
      mode: 'preview',
      last7DaysCount: last7Days.length,
      sample: last7Days.slice(0, 3),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}