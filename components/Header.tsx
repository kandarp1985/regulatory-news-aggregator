'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RefreshButton from './RefreshButton';

export default function Header() {
  const pathname = usePathname();
  const isBookmarks = pathname === '/bookmarks';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(3, 8, 16, 0.92)',
      borderBottom: '1px solid #00e5ff',
      boxShadow: '0 0 20px rgba(0, 229, 255, 0.12), inset 0 -1px 0 rgba(0, 229, 255, 0.08)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }}>
      {/* Corner accents */}
      <span style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderLeft: '2px solid #00e5ff', borderTop: '2px solid #00e5ff', display: 'block' }} />
      <span style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderRight: '2px solid #00e5ff', borderTop: '2px solid #00e5ff', display: 'block' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 8,
            background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            boxShadow: '0 0 16px rgba(0, 229, 255, 0.35)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
          }}>
            ⚕
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1.25rem', fontWeight: 700,
              color: '#d8eeff', letterSpacing: '0.04em',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
              lineHeight: 1.2,
            }}>
              Regulatory Affairs News
            </h1>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.68rem', color: '#00e5ff',
              letterSpacing: '0.08em', opacity: 0.7,
            }}>
              FDA · MHRA · HC · CDC · NIH
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <RefreshButton />

          <Link
            href="/"
            style={{
              padding: '0.35rem 0.85rem', borderRadius: 4, fontSize: '0.82rem',
              fontFamily: "'Share Tech Mono', monospace", fontWeight: 600,
              letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.18s ease',
              textDecoration: 'none',
              background: !isBookmarks ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              border: `1px solid ${!isBookmarks ? 'rgba(0, 229, 255, 0.4)' : '#0d2240'}`,
              color: !isBookmarks ? '#00e5ff' : '#5a8aad',
              boxShadow: !isBookmarks ? '0 0 8px rgba(0, 229, 255, 0.15)' : 'none',
            }}
          >
            ◈ News
          </Link>

          <Link
            href="/bookmarks"
            style={{
              padding: '0.35rem 0.85rem', borderRadius: 4, fontSize: '0.82rem',
              fontFamily: "'Share Tech Mono', monospace", fontWeight: 600,
              letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.18s ease',
              textDecoration: 'none',
              background: isBookmarks ? 'rgba(124, 77, 255, 0.08)' : 'transparent',
              border: `1px solid ${isBookmarks ? 'rgba(124, 77, 255, 0.4)' : '#0d2240'}`,
              color: isBookmarks ? '#7c4dff' : '#5a8aad',
              boxShadow: isBookmarks ? '0 0 8px rgba(124, 77, 255, 0.15)' : 'none',
            }}
          >
            ★ Bookmarks
          </Link>
        </nav>
      </div>
    </header>
  );
}