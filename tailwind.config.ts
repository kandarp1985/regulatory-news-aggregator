import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Exo 2', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Share Tech Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        techno: {
          bg:       'var(--bg-primary)',
          card:     'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          border:   'var(--border)',
          'border-bright': 'var(--border-bright)',
          us:       'var(--accent-us)',
          uk:       'var(--accent-uk)',
          ca:       'var(--accent-ca)',
          fda:      'var(--accent-fda)',
          cdc:      'var(--accent-cdc)',
          nih:      'var(--accent-nih)',
          mhra:     'var(--accent-mhra)',
          hc:       'var(--accent-hc)',
          ukhsa:    'var(--accent-ukhsa)',
          phac:     'var(--accent-phac)',
        },
      },
    },
  },
  plugins: [],
};

export default config;