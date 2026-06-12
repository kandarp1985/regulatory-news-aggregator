'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article, NewsApiResponse } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import FilterBar from '@/components/FilterBar';
import RefreshButton from '@/components/RefreshButton';

function SkeletonCard({ index = 0 }: { index?: number }) {
  const colors = ['#00e5ff', '#7c4dff', '#ff6b35', '#ff4d6d', '#00b4d8'];
  const accent = colors[index % colors.length];
  return (
    <div style={{
      background: '#060e1a',
      border: '1px solid #0d2240',
      borderRadius: 6,
      padding: '1.1rem 1.3rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      animation: 'pulse 1.8s ease-in-out infinite',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: 20, width: 60, borderRadius: 4, background: `${accent}20`, border: `1px solid ${accent}30` }} />
        <div style={{ height: 14, width: 36, borderRadius: 3, background: '#0d2240' }} />
      </div>
      <div style={{ height: 18, borderRadius: 4, background: '#0d2240' }} />
      <div style={{ height: 18, borderRadius: 4, background: '#0d2240', width: '75%' }} />
      <div style={{ height: 14, borderRadius: 3, background: '#0a1628' }} />
      <div style={{ height: 14, borderRadius: 3, background: '#0a1628', width: '85%' }} />
      <div style={{ height: 14, borderRadius: 3, background: '#0a1628', width: '65%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <div style={{ height: 12, width: 50, borderRadius: 3, background: '#091828' }} />
        <div style={{ height: 12, width: 65, borderRadius: 3, background: '#091828' }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'UK', 'CA']);
  const [keyword, setKeyword] = useState('');

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: NewsApiResponse = await res.json();
      setArticles(data.articles);
      setFetchedAt(data.fetchedAt);
      (window as unknown as { __newsCount?: number }).__newsCount = data.articles.length;
    } catch (err) {
      setError('Failed to load feeds. Please try refreshing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const handleRefresh = () => fetchNews();
    window.addEventListener('news-refresh', handleRefresh);
    return () => window.removeEventListener('news-refresh', handleRefresh);
  }, [fetchNews]);

  const filteredArticles = articles.filter((article) => {
    if (!selectedCountries.includes(article.country)) return false;
    if (keyword) {
      const search = keyword.toLowerCase();
      const searchableText = `${article.title} ${article.summary} ${article.agency} ${article.tags.join(' ')}`.toLowerCase();
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
      <FilterBar />

      {/* Error banner */}
      {error && (
        <div style={{
          margin: '1rem 0', padding: '0.85rem 1rem',
          background: 'rgba(255, 77, 109, 0.08)',
          border: '1px solid rgba(255, 77, 109, 0.35)',
          borderRadius: 6,
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
        background: '#060e1a',
        border: '1px solid #0d2240',
        borderRadius: 6,
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
              <span style={{ color: '#00e5ff' }}>◈ </span>
              Showing{' '}
              <span style={{ color: '#d8eeff', fontWeight: 700 }}>{filteredArticles.length}</span>
              {' '}of{' '}
              <span style={{ color: '#d8eeff', fontWeight: 700 }}>{articles.length}</span>
              {' '}articles
            </>
          )}
        </p>

        {fetchedAt && !loading && (
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem', color: '#2d5275', letterSpacing: '0.04em',
          }}>
            Last updated: {formatFetchedAt(fetchedAt)}
          </p>
        )}
      </div>

      {/* Article grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1rem',
        }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '1rem', color: '#2d5275', letterSpacing: '0.04em',
          }}>
            No articles match your current filters.
          </p>
          <button
            onClick={() => { setSelectedCountries(['US', 'UK', 'CA']); setKeyword(''); }}
            style={{
              marginTop: '0.75rem', padding: '0.4rem 1rem',
              background: 'transparent', border: '1px solid #1a3a5c',
              borderRadius: 4, color: '#00e5ff',
              fontFamily: "'Share Tech Mono', monospace",
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1rem',
        }}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}