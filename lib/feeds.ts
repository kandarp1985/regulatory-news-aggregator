import { FeedConfig } from '@/types/article';

export const FEEDS: FeedConfig[] = [
  // 🇺🇸 United States — FDA
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-announcements/rss.xml',
    source: 'FDA Press Announcements',
    agency: 'FDA',
    country: 'US',
  },
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/medwatch/rss.xml',
    source: 'FDA MedWatch Safety Alerts',
    agency: 'FDA',
    country: 'US',
  },
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/drug-approvals-and-databases/rss.xml',
    source: 'FDA Drug Approvals',
    agency: 'FDA',
    country: 'US',
  },
  {
    url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/recalls/rss.xml',
    source: 'FDA Recalls',
    agency: 'FDA',
    country: 'US',
  },
  // 🇺🇸 United States — Other
  {
    url: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    source: 'CDC Newsroom',
    agency: 'CDC',
    country: 'US',
  },
  {
    url: 'https://www.nih.gov/news-events/news-releases/feed',
    source: 'NIH News Releases',
    agency: 'NIH',
    country: 'US',
  },
  // 🇬🇧 United Kingdom
  {
    url: 'https://www.gov.uk/search/news-and-communications.atom?organisations%5B%5D=medicines-and-healthcare-products-regulatory-agency',
    source: 'MHRA News',
    agency: 'MHRA',
    country: 'UK',
  },
  {
    url: 'https://www.gov.uk/drug-safety-update.atom',
    source: 'MHRA Drug Safety Updates',
    agency: 'MHRA',
    country: 'UK',
  },
  {
    url: 'https://www.gov.uk/search/news-and-communications.atom?organisations%5B%5D=uk-health-security-agency',
    source: 'UK Health Security Agency',
    agency: 'UKHSA',
    country: 'UK',
  },
  // 🇨🇦 Canada
  {
    url: 'https://www.canada.ca/en/health-canada/news.atom',
    source: 'Health Canada News',
    agency: 'Health Canada',
    country: 'CA',
  },
  {
    url: 'https://www.canada.ca/api/node/rss/recalls?type=health-product',
    source: 'Health Canada Drug Recalls',
    agency: 'Health Canada',
    country: 'CA',
  },
  {
    url: 'https://www.canada.ca/en/public-health/news.atom',
    source: 'Public Health Agency of Canada',
    agency: 'PHAC',
    country: 'CA',
  },
];