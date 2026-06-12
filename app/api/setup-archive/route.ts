import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://mnrpltjecfhqtrbaxica.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ISyXKnRtp89eZ7-7rDE7TQ_nhy07fsS';

// One-time setup: create articles archive table
// Run once by visiting /api/setup-archive?key=setup_2026
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'setup_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS articles (
      id          TEXT    NOT NULL,
      date        DATE    NOT NULL,
      title       TEXT    NOT NULL,
      summary     TEXT,
      link        TEXT    NOT NULL,
      published_at TIMESTAMPTZ,
      source      TEXT,
      country     TEXT,
      agency      TEXT,
      tags        TEXT[],
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (id, date)
    );
  `;

  try {
    // Use pg_catalog to execute DDL
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pgrest_alter_table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ sql: createTableSQL }),
    });
    const text = await res.text();
    return NextResponse.json({ ok: res.ok, status: res.status, body: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}