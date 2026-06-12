'use client';

import { useState } from 'react';
import { Article } from '@/types/article';
import BookmarkButton from './BookmarkButton';

interface ArticleCardProps {
  article: Article;
}

const COUNTRY_CONFIG: Record<string, { label: string; color: string }> = {
  US: { label: 'US',    color: '#00e5ff' },
  UK: { label: 'UK',    color: '#7c4dff' },
  CA: { label: 'CA',    color: '#ff6b35' },
};

const AGENCY_CONFIG: Record<string, { color: string; bg: string }> = {
  FDA:                       { color: '#ff4d6d', bg: 'rgba(255, 77, 109, 0.12)' },
  CDC:                       { color: '#00b4d8', bg: 'rgba(0, 180, 216, 0.12)' },
  NIH:                       { color: '#4cc9f0', bg: 'rgba(76, 201, 240, 0.12)' },
  MHRA:                      { color: '#7b68ee', bg: 'rgba(123, 104, 238, 0.12)' },
  'UK Health Security Agency':{ color: '#06d6a0', bg: 'rgba(6, 214, 160, 0.12)' },
  'Health Canada':            { color: '#ff9f1c', bg: 'rgba(255, 159, 28, 0.12)' },
  PHAC:                      { color: '#f4a261', bg: 'rgba(244, 162, 97, 0.12)' },
};

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [hovered, setHovered] = useState(false);

  const agencyCfg = AGENCY_CONFIG[article.agency] || { color: '#5a8aad', bg: 'rgba(90, 138, 173, 0.12)' };
  const countryCfg = COUNTRY_CONFIG[article.country] || { label: article.country, color: '#5a8aad' };
  const accent = hovered ? agencyCfg.color : 'transparent';

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? '#0a1628' : '#060e1a',
        border: `1px solid ${hovered ? `${agencyCfg.color}60` : '#0d2240'}`,
        borderRadius: 6,
        padding: '1.1rem 1.3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered
          ? `0 0 20px ${agencyCfg.color}25, 0 12px 30px rgba(0,0,0,0.4)`
          : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${agencyCfg.color}, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0.18rem 0.55rem', borderRadius: 4, fontSize: '0.72rem',
          fontFamily: "'Share Tech Mono', monospace", fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: agencyCfg.color, background: agencyCfg.bg,
          border: `1px solid ${agencyCfg.color}40`,
        }}>
          {article.agency}
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.75rem', color: countryCfg.color,
          letterSpacing: '0.04em', fontWeight: 600,
        }}>
          {countryCfg.label}
        </span>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Exo 2', sans-serif",
        fontSize: '1.05rem', fontWeight: 600,
        color: '#d8eeff', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit', textDecoration: 'none',
            transition: hovered ? 'none' : 'color 0.18s ease',
          }}
        >
          {article.title}
        </a>
      </h2>

      {/* Summary */}
      <p style={{
        fontFamily: "'Exo 2', sans-serif",
        fontSize: '0.88rem', color: '#5a8aad', lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {article.summary || 'No description available.'}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.5rem', marginTop: 'auto', paddingTop: '0.2rem',
      }}>
        <time style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.75rem', color: '#2d5275', letterSpacing: '0.03em',
        }}>
          {formatDate(article.publishedAt)}
        </time>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.78rem', fontWeight: 600,
              color: '#5a8aad', textDecoration: 'none',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease, color 0.18s ease, text-shadow 0.18s ease',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = agencyCfg.color; e.currentTarget.style.textShadow = `0 0 8px ${agencyCfg.color}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5a8aad'; e.currentTarget.style.textShadow = 'none'; }}
          >
            Read More →
          </a>
          <BookmarkButton articleId={article.id} />
        </div>
      </div>

      {/* Source */}
      <p style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.7rem', color: '#2d5275', letterSpacing: '0.03em',
      }}>
        {article.source}
      </p>
    </article>
  );
}