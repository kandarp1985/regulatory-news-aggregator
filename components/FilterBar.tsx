'use client';

import { useState, useEffect } from 'react';

const QUICK_FILTERS = [
  { category: 'Drug Actions', keywords: ['Drug Approval', 'Drug Recall', 'Generic Drug', 'Biosimilar'] },
  { category: 'Safety', keywords: ['Safety Alert', 'MedWatch', 'Adverse Event', 'Risk Communication'] },
  { category: 'Biologics', keywords: ['Vaccine', 'Biologics', 'Clinical Trial', 'Orphan Drug'] },
  { category: 'Regulatory', keywords: ['Guidance Document', 'Regulatory Submission', '510(k)', 'NDA', 'BLA'] },
  { category: 'Public Health', keywords: ['Outbreak', 'Pandemic', 'Food Safety', 'Labeling'] },
];

interface FilterBarProps {
  selectedCountries: string[];
  onCountryChange: (countries: string[]) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

const STORAGE_KEY = 'reg-filters';

const COUNTRY_CONFIG: Record<string, { label: string; flag: string; color: string }> = {
  US: { label: 'US', flag: '🇺🇸', color: '#00e5ff' },
  UK: { label: 'UK', flag: '🇬🇧', color: '#7c4dff' },
  CA: { label: 'CA', flag: '🇨🇦', color: '#ff6b35' },
};

const SECTION_LABELS: Record<string, string> = {
  'Drug Actions': '#ff4d6d',
  'Safety': '#f59e0b',
  'Biologics': '#00b4d8',
  'Regulatory': '#7c4dff',
  'Public Health': '#06d6a0',
};

export default function FilterBar({
  selectedCountries,
  onCountryChange,
  keyword,
  onKeywordChange,
}: FilterBarProps) {
  const [showChips, setShowChips] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { countries, keyword: savedKeyword } = JSON.parse(saved);
        if (countries && Array.isArray(countries)) onCountryChange(countries);
        if (savedKeyword) onKeywordChange(savedKeyword);
      }
    } catch { /* ignore */ }
  }, []);

  const toggleCountry = (country: string) => {
    const newCountries = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];
    onCountryChange(newCountries);
    saveFilters(newCountries, keyword);
  };

  const handleKeywordChange = (value: string) => {
    onKeywordChange(value);
    saveFilters(selectedCountries, value);
  };

  const saveFilters = (countries: string[], kw: string) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ countries, keyword: kw })); } catch { /* ignore */ }
  };

  const selectChip = (chipKeyword: string) => {
    onKeywordChange(chipKeyword);
    saveFilters(selectedCountries, chipKeyword);
    setShowChips(false);
  };

  return (
    <div style={{
      position: 'sticky', top: 80, zIndex: 90,
      background: 'rgba(3, 8, 16, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #0d2240',
      padding: '0.85rem 2rem',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>

        {/* Country filters row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem',
            color: '#5a8aad', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Country:
          </span>

          {Object.entries(COUNTRY_CONFIG).map(([code, cfg]) => {
            const isSelected = selectedCountries.includes(code);
            const accent = cfg.color;
            return (
              <button
                key={code}
                onClick={() => toggleCountry(code)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.35rem 0.85rem', borderRadius: 4,
                  border: `1px solid ${isSelected ? accent : '#1a3a5c'}`,
                  background: isSelected ? `${accent}14` : 'transparent',
                  color: isSelected ? accent : '#5a8aad',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em',
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  boxShadow: isSelected ? `0 0 8px ${accent}30` : 'none',
                }}
              >
                <span>{cfg.flag}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <svg
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#5a8aad', pointerEvents: 'none' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => setShowChips(true)}
              placeholder="Search articles..."
              style={{
                width: '100%', padding: '0.45rem 0.75rem 0.45rem 2.25rem',
                fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace",
                borderRadius: 4, border: '1px solid #1a3a5c',
                background: '#060e1a', color: '#d8eeff',
                outline: 'none', transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                letterSpacing: '0.02em',
              }}
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = '#00e5ff';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 229, 255, 0.2)';
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = '#1a3a5c';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {keyword && (
            <button
              onClick={() => handleKeywordChange('')}
              style={{
                padding: '0.45rem 0.75rem', fontSize: '0.78rem',
                fontFamily: "'Share Tech Mono', monospace",
                color: '#5a8aad', background: 'transparent',
                border: '1px solid #1a3a5c', borderRadius: 4, cursor: 'pointer',
                transition: 'all 0.15s ease', letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.color = '#5a8aad'; }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick filter chips */}
        {showChips && (
          <div style={{
            marginTop: '0.65rem', padding: '0.75rem 1rem',
            background: '#060e1a', border: '1px solid #0d2240', borderRadius: 6,
          }}>
            {QUICK_FILTERS.map((group) => (
              <div key={group.category} style={{ marginBottom: '0.65rem' }}>
                <p style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem',
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: SECTION_LABELS[group.category] || '#5a8aad',
                  marginBottom: '0.5rem',
                }}>
                  {group.category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {group.keywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => selectChip(kw)}
                      style={{
                        padding: '0.2rem 0.6rem', fontSize: '0.72rem',
                        fontFamily: "'Share Tech Mono', monospace",
                        borderRadius: 3, border: '1px solid #1a3a5c',
                        background: '#0a1628', color: '#8fa3be',
                        cursor: 'pointer', transition: 'all 0.15s ease', letterSpacing: '0.03em',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00e5ff';
                        e.currentTarget.style.color = '#00e5ff';
                        e.currentTarget.style.boxShadow = '0 0 6px rgba(0, 229, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#1a3a5c';
                        e.currentTarget.style.color = '#8fa3be';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}