import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Regulatory Affairs News Aggregator',
  description: 'Monitor FDA, MHRA, Health Canada, CDC, and NIH regulatory updates in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid #0d2240',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          background: 'rgba(3, 8, 16, 0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.78rem', color: '#2d5275', letterSpacing: '0.06em',
          }}>
            Regulatory Affairs News Aggregator
          </p>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.68rem', color: '#1a3a5c', letterSpacing: '0.08em',
            marginTop: '0.35rem',
          }}>
            Sources: FDA · CDC · NIH · MHRA · UKHSA · Health Canada · PHAC
          </p>
        </footer>
      </body>
    </html>
  );
}