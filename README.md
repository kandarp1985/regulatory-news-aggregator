# Regulatory Affairs News Aggregator

A production-ready web application that aggregates regulatory news from FDA, MHRA, Health Canada, CDC, and NIH. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3
- **Data Fetching:** RSS/Atom feed parsing via `rss-parser`
- **Scheduling:** Vercel Cron Jobs (daily auto-refresh at 6 AM UTC)
- **Bookmarks:** localStorage (client-side, no auth required)
- **Deployment:** Vercel (via GitHub)

## Features

- 📰 Aggregates news from 11 official government RSS/Atom feeds
- 🌍 Filter by country: US, UK, Canada
- 🔍 Keyword search across title, summary, and tags
- ⚡ Quick-filter chips for common regulatory categories
- 🔖 Bookmark articles for later reference
- 🔄 Manual and automatic daily refresh
- 🌙 Dark mode support
- 📱 Fully responsive design

## Data Sources

### 🇺🇸 United States
- FDA Press Announcements
- FDA MedWatch Safety Alerts
- FDA Drug Approvals
- FDA Recalls
- CDC Newsroom
- NIH News Releases

### 🇬🇧 United Kingdom
- MHRA News
- MHRA Drug Safety Updates
- UK Health Security Agency

### 🇨🇦 Canada
- Health Canada News
- Health Canada Drug Recalls
- Public Health Agency of Canada

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd regulatory-news-aggregator

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

The app is configured for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically on push

A cron job runs daily at 6:00 AM UTC to refresh the feed cache.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── news/route.ts      # GET /api/news
│   │   └── refresh/route.ts   # POST /api/refresh
│   ├── bookmarks/page.tsx    # Bookmarks page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ArticleCard.tsx
│   ├── BookmarkButton.tsx
│   ├── FilterBar.tsx
│   ├── Header.tsx
│   └── RefreshButton.tsx
├── lib/
│   ├── bookmarks.ts           # localStorage utilities
│   ├── feeds.ts                # Feed configuration
│   └── parser.ts               # RSS parsing logic
├── types/
│   └── article.ts              # TypeScript interfaces
├── vercel.json                # Cron job config
└── README.md
```

## License

MIT