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
        if (countries && Array.isArray(countries)) {
          onCountryChange(countries);
        }
        if (savedKeyword) {
          onKeywordChange(savedKeyword);
        }
      }
    } catch {
      // Ignore errors
    }
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ countries, keyword: kw }));
    } catch {
      // Ignore errors
    }
  };

  const selectChip = (chipKeyword: string) => {
    onKeywordChange(chipKeyword);
    saveFilters(selectedCountries, chipKeyword);
    setShowChips(false);
  };

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Country filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Country:</span>
          {['US', 'UK', 'CA'].map((country) => {
            const flags: Record<string, string> = { US: '🇺🇸', UK: '🇬🇧', CA: '🇨🇦' };
            const labels: Record<string, string> = { US: 'US', UK: 'UK', CA: 'Canada' };
            const isSelected = selectedCountries.includes(country);
            return (
              <button
                key={country}
                onClick={() => toggleCountry(country)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {flags[country]} {labels[country]}
              </button>
            );
          })}
        </div>

        {/* Keyword search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => setShowChips(true)}
              placeholder="Search articles..."
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {keyword && (
            <button
              onClick={() => handleKeywordChange('')}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick filter chips */}
        {showChips && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-3">
            {QUICK_FILTERS.map((group) => (
              <div key={group.category}>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{group.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.keywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => selectChip(kw)}
                      className="px-2.5 py-1 text-xs rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
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