'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';

interface NewsClientProps {
  initialArticles: Article[];
}

type Range = 'today' | '7d' | '30d';

const RANGE_LABELS: Record<Range, string> = {
  today: 'Today',
  '7d':  '7 Days',
  '30d': '30 Days',
};

const RANGE_COLORS: Record<Range, string> = {
  today: '#00e5ff',
  '7d':  '#7c4dff',
  '30d': '#f59e0b',
};

function SkeletonCard({ index = 0 }: { index?: number }) {
  const colors = ['#00e5ff', '#7c4dff', '#ff6b35', '#ff4d6d', '#00b4d8'];
  const accent = colors[index % colors.length];
  return (
    <div style={{
      background: '#060e1a', border: '1px solid #0d2240', borderRadius: 6,
      padding: '1.1rem 1.3rem', display: 'flex', flexDirection: 'column',
      gap: '0.6rem', animation: 'pulse 1.8s ease-in-out infinite',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: 20, width: 60, borderRadius: 4, background: `${accent}20`, border: `1px solid ${accent}30` }} />
        <div style={{ height: 14, width: 36, borderRadius: 3, background: '#0d2240' }} />
      </div>
      <div style={{ height: 18, borderRadius: 4, background: '#0d2240' }} />
      <div style={{ height: 18, borderRadius: 4, background: '#0d2240', width: '75%' }} />
      <div style={{ height: 14, borderRadius: 3, background: '#0a1628' }} />
      <div style={{ height: 14, borderRadius: 3, background: '#0a1628', width: '85%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <div style={{ height: 12, width: 50, borderRadius: 3, background: '#091828' }} />
        <div style={{ height: 12, width: 65, borderRadius: 3, background: '#091828' }} />
      </div>
    </div>
  );
}

export default function NewsClient({ initialArticles }: NewsClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'UK', 'CA']);
  const [keyword, setKeyword] = useState('');
  const [range, setRange] = useState<Range>('today');
  const [isFetchingRange, setIsFetchingRange] = useState(false);

  // Fetch articles for a specific date range
  const fetchRange = useCallback(async (r: Range) => {
    if (r === 'today') {
      // Use initial articles (already loaded) — just refresh live
      try {
        setLoading(true);
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setArticles(data.articles ?? []);
        setFetchedAt(data.fetchedAt ?? new Date().toISOString());
      } catch {
        setError('Failed to refresh. Try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Historical range from Supabase
      setIsFetchingRange(true);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news?range=${r}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setArticles(data.articles ?? []);
        setFetchedAt(data.fetchedAt ?? new Date().toISOString());
      } catch {
        setError(`Failed to load ${RANGE_LABELS[r]} articles.`);
      } finally {
        setLoading(false);
        setIsFetchingRange(false);
      }
    }
  }, []);

  // Listen for manual refresh events
  useEffect(() => {
    const handleRefresh = () => fetchRange(range);
    window.addEventListener('news-refresh', handleRefresh);
    return () => window.removeEventListener('news-refresh', handleRefresh);
  }, [range, fetchRange]);

  // When range changes, fetch new data
  const handleRangeChange = (r: Range) => {
    setRange(r);
    fetchRange(r);
  };

  const filteredArticles = (articles ?? []).filter((article: Article) => {
    if (!selectedCountries.includes(article.country)) return false;
    if (keyword) {
      const search = keyword.toLowerCase();
      const searchableText = `${article.title} ${article.summary} ${article.agency} ${article.tags?.join(' ') ?? ''}`.toLowerCase();
      if (!searchableText.includes(search)) return false;
    }
    return true;
  });

  const formatFetchedAt = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch { return dateString; }
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '1rem 2rem 3rem' }}>

      {/* ── Date Range Filter ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '0.85rem', flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem',
          color: '#2d5275', letterSpacing: '0.08em', textTransform: 'uppercase',
          marginRight: '0.25rem',
        }}>
          Period:
        </span>
        {(['today', '7d', '30d'] as Range[]).map((r) => {
          const active = range === r;
          const color = RANGE_COLORS[r];
          return (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.35rem 0.9rem', borderRadius: 4,
                border: `1px solid ${active ? color : '#1a3a5c'}`,
                background: active ? `${color}14` : 'transparent',
                color: active ? color : '#5a8aad',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em',
                cursor: 'pointer', transition: 'all 0.18s ease',
                boxShadow: active ? `0 0 10px ${color}30` : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.color = color;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = '#1a3a5c';
                  e.currentTarget.style.color = '#5a8aad';
                }
              }}
            >
              {active && <span style={{ color: color }}>◈</span>}
              {RANGE_LABELS[r]}
            </button>
          );
        })}

        {/* Status dot */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isFetchingRange && (
            <svg style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite', color: '#5a8aad' }} fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem',
            color: '#2d5275', letterSpacing: '0.04em',
          }}>
            {range === 'today' ? 'Live' : range === '7d' ? 'Supabase' : 'Supabase'}
          </span>
        </div>
      </div>

      <FilterBar
        selectedCountries={selectedCountries}
        onCountryChange={setSelectedCountries}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {/* Error banner */}
      {error && (
        <div style={{
          margin: '1rem 0', padding: '0.85rem 1rem',
          background: 'rgba(255, 77, 109, 0.08)',
          border: '1px solid rgba(255, 77, 109, 0.35)', borderRadius: 6,
          boxShadow: '0 0 12px rgba(255, 77, 109, 0.15)',
        }}>
          <p style={{ color: '#ff4d6d', fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace" }}>
            {error}
          </p>
        </div>
      )}

      {/* Stats bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.65rem 1rem', margin: '0.75rem 0',
        background: '#060e1a', border: '1px solid #0d2240', borderRadius: 6,
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.82rem', color: '#5a8aad', letterSpacing: '0.03em',
        }}>
          {loading ? (
            <span style={{ color: '#2d5275' }}>Loading articles...</span>
          ) : (
            <>
              <span style={{ color: RANGE_COLORS[range] }}>◈ </span>
              {range === 'today'
                ? `${filteredArticles.length} articles today`
                : `${filteredArticles.length} articles — ${RANGE_LABELS[range]}`}
            </>
          )}
        </p>
        {fetchedAt && !loading && (
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem', color: '#2d5275', letterSpacing: '0.04em',
          }}>
            {range === 'today' ? 'Live · ' : 'Archived · '}{formatFetchedAt(fetchedAt)}
          </p>
        )}
      </div>

      {/* Empty state: no archived data yet */}
      {!loading && range !== 'today' && filteredArticles.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '2.5rem 1rem',
          background: '#060e1a', border: '1px dashed #1a3a5c', borderRadius: 6,
          marginBottom: '1rem',
        }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', color: '#2d5275', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            No archived data for this period yet.
          </p>
          <p style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '0.82rem', color: '#1a3a5c', lineHeight: 1.5 }}>
            The cron job archives articles daily at midnight. Check back after the first run.
          </p>
        </div>
      )}

      {/* Article grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
        </div>
      ) : filteredArticles.length === 0 && range === 'today' ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1rem', color: '#2d5275', letterSpacing: '0.04em' }}>
            No articles match your current filters.
          </p>
          <button
            onClick={() => { setSelectedCountries(['US', 'UK', 'CA']); setKeyword(''); }}
            style={{
              marginTop: '0.75rem', padding: '0.4rem 1rem',
              background: 'transparent', border: '1px solid #1a3a5c', borderRadius: 4,
              color: '#00e5ff', fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.04em',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 229, 255, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}