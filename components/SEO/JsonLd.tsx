'use client';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Qadaa Tracker',
  description:
    'A spiritual companion app to help Muslims track and make up their missed prayers and fasts',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://qadaa-tracker.web.app',
  logo: `${
    process.env.NEXT_PUBLIC_BASE_URL || 'https://qadaa-tracker.web.app'
  }/icons/icon-512.png`,
  sameAs: [],
};

// WebApplication Schema
export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Qadaa Tracker',
  alternateName: 'متتبع القضاء',
  description:
    'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam). تطبيق روحاني لمساعدة المسلمين على تتبع وقضاء صلواتهم وصيامهم الفائت.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://qadaa-tracker.web.app',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  inLanguage: ['en', 'ar'],
  featureList: [
    'Track missed prayers (Qadaa Salah)',
    'Track missed fasts (Qadaa Siyam)',
    'Hijri calendar integration',
    'Progress tracking',
    'Bilingual support (Arabic/English)',
    'PWA support for offline access',
  ],
  screenshot: `${
    process.env.NEXT_PUBLIC_BASE_URL || 'https://qadaa-tracker.web.app'
  }/screenshots/dashboard.png`,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
};

// FAQ Schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Qadaa in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Qadaa refers to making up missed obligatory prayers (Salah) or fasts (Siyam) that were missed due to valid reasons like illness, travel, or menstruation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Qadaa Tracker help Muslims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Qadaa Tracker helps Muslims calculate the number of missed prayers and fasts based on date ranges, track their progress as they make them up, and stay motivated on their spiritual journey.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Qadaa Tracker use the Hijri calendar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Qadaa Tracker integrates with the Hijri calendar for accurate Ramadan date calculations, ensuring precise tracking of missed fasts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Qadaa Tracker free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, Qadaa Tracker is completely free to use. It's a spiritual tool designed to help Muslims fulfill their religious obligations.",
      },
    },
  ],
};

// BreadcrumbList Schema Generator
export const generateBreadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
