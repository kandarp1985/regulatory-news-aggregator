'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { getBookmarks, removeBookmark, clearAllBookmarks } from '@/lib/bookmarks';
import ArticleCard from '@/components/ArticleCard';

export default function BookmarksPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const loadBookmarks = async () => {
      const ids = getBookmarks();
      setBookmarkedIds(ids);
      if (ids.length === 0) { setLoading(false); return; }
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setArticles(data.articles.filter((article: Article) => ids.includes(article.id)));
      } catch (err) { console.error('Failed to load articles:', err); }
      finally { setLoading(false); }
    };
    loadBookmarks();
  }, []);

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarkedIds((prev) => prev.filter((bid) => bid !== id));
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    clearAllBookmarks();
    setBookmarkedIds([]);
    setArticles([]);
    setShowClearConfirm(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const ids = getBookmarks();
      setBookmarkedIds(ids);
      if (ids.length === 0) setArticles([]);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookmark-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmark-changed', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', color: '#2d5275', letterSpacing: '0.05em' }}>
          Loading bookmarks...
        </p>
      </div>
    );
  }

  if (bookmarkedIds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: 480, margin: '0 auto' }}>
        <svg style={{ width: 52, height: 52, color: '#1a3a5c', margin: '0 auto 1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h2 style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#d8eeff', marginBottom: '0.5rem' }}>
          No bookmarks yet
        </h2>
        <p style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '0.88rem', color: '#5a8aad', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Save articles for later by clicking the bookmark icon on any article card.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1.1rem', borderRadius: 4,
            background: 'rgba(0, 229, 255, 0.07)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            color: '#00e5ff',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em',
            textDecoration: 'none', transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.12)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 229, 255, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ← Browse Articles
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '1rem 2rem 3rem' }}>
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.25rem', padding: '0.65rem 1rem',
        background: '#060e1a', border: '1px solid #0d2240', borderRadius: 6,
        flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <h1 style={{
          fontFamily: "'Exo 2', sans-serif",
          fontSize: '1.15rem', fontWeight: 700, color: '#d8eeff',
        }}>
          <span style={{ color: '#f59e0b' }}>★ </span>
          Your Bookmarks ({bookmarkedIds.length})
        </h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          style={{
            padding: '0.35rem 0.85rem', borderRadius: 4, fontSize: '0.78rem',
            fontFamily: "'Share Tech Mono', monospace",
            background: 'transparent', border: '1px solid #1a3a5c',
            color: '#ff4d6d', cursor: 'pointer', letterSpacing: '0.04em',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 109, 0.08)'; e.currentTarget.style.borderColor = '#ff4d6d'; e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 77, 109, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Clear All Bookmarks
        </button>
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: '#0a1628', border: '1px solid #1a3a5c', borderRadius: 8,
            padding: '1.5rem', maxWidth: 360, width: '90%',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
          }}>
            <h3 style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#d8eeff', marginBottom: '0.5rem' }}>
              Clear all bookmarks?
            </h3>
            <p style={{ fontFamily: "'Exo 2', sans-serif", fontSize: '0.85rem', color: '#5a8aad', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              This will remove all {bookmarkedIds.length} bookmarks. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 4, border: '1px solid #1a3a5c',
                  background: 'transparent', color: '#5a8aad',
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '0.82rem',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5a8aad'; e.currentTarget.style.color = '#d8eeff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.color = '#5a8aad'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 4,
                  background: 'rgba(255, 77, 109, 0.15)',
                  border: '1px solid rgba(255, 77, 109, 0.4)',
                  color: '#ff4d6d',
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '0.82rem',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 109, 0.25)'; e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 77, 109, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 109, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact bookmark list */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {articles.map((article) => (
          <div key={article.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: '#060e1a', border: '1px solid #0d2240',
            borderRadius: 6, padding: '0.75rem 1rem',
            transition: 'border-color 0.15s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#0d2240'; }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Exo 2', sans-serif", fontSize: '0.88rem',
                  fontWeight: 600, color: '#d8eeff', textDecoration: 'none',
                  display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#00e5ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#d8eeff'; }}
              >
                {article.title}
              </a>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.72rem', color: '#2d5275', marginTop: '0.2rem', letterSpacing: '0.03em',
              }}>
                {article.agency} · {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => handleRemoveBookmark(article.id)}
              style={{
                padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #0d2240',
                background: 'transparent', color: '#2d5275', cursor: 'pointer',
                fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem',
                transition: 'all 0.15s ease', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff4d6d'; e.currentTarget.style.color = '#ff4d6d'; e.currentTarget.style.background = 'rgba(255, 77, 109, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#0d2240'; e.currentTarget.style.color = '#2d5275'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Remove bookmark"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Section divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #0d2240, transparent)' }} />
        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', color: '#2d5275', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Article Cards
        </p>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #0d2240, transparent)' }} />
      </div>

      {/* Full article cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}