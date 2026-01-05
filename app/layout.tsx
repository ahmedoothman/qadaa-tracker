import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import DirectionWrapper from '@/components/DirectionWrapper';
import JsonLd, {
  organizationSchema,
  webAppSchema,
  faqSchema,
} from '@/components/SEO/JsonLd';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://qadaa-tracker.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Qadaa Tracker - Track Your Missed Prayers & Fasts | متتبع القضاء',
    template: '%s | Qadaa Tracker',
  },
  description:
    'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam). Track your Qadaa journey with ease. تطبيق روحاني لمساعدة المسلمين على تتبع وقضاء صلواتهم وصيامهم الفائت.',
  keywords: [
    'qadaa',
    'qadaa salah',
    'qadaa siyam',
    'missed prayers',
    'missed fasts',
    'salah tracker',
    'siyam tracker',
    'prayer tracker',
    'fasting tracker',
    'islamic app',
    'muslim app',
    'ramadan tracker',
    'hijri calendar',
    'قضاء',
    'قضاء الصلاة',
    'قضاء الصيام',
    'صلاة',
    'صيام',
    'تتبع الصلاة',
    'تتبع الصيام',
    'رمضان',
    'التقويم الهجري',
  ],
  authors: [{ name: 'Qadaa Tracker' }],
  creator: 'Qadaa Tracker',
  publisher: 'Qadaa Tracker',
  manifest: '/manifest.json',
  category: 'Religion & Spirituality',
  classification: 'Islamic Application',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: baseUrl,
    siteName: 'Qadaa Tracker',
    title: 'Qadaa Tracker - Track Your Missed Prayers & Fasts | متتبع القضاء',
    description:
      'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam). Track your Qadaa journey with ease.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Qadaa Tracker - Track Your Missed Prayers & Fasts',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Qadaa Tracker - Track Your Missed Prayers & Fasts',
    description:
      'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam).',
    images: ['/og-image.png'],
    creator: '@qadaatracker',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qadaa Tracker',
  },

  // Verification (add your verification codes)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    // yandex: '',
    // bing: '',
  },

  // Alternate languages
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': `${baseUrl}/en`,
      'ar-SA': `${baseUrl}/ar`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f766e' },
    { media: '(prefers-color-scheme: dark)', color: '#0f766e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const lang = localStorage.getItem('qadaa-tracker-language') || 'ar';
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = lang;
              } catch (e) {}
            `,
          }}
        />
        <JsonLd data={organizationSchema} />
        <JsonLd data={webAppSchema} />
        <JsonLd data={faqSchema} />
      </head>
      <body
        className={`${inter.variable} ${notoSansArabic.variable} antialiased`}
      >
        <LanguageProvider>
          <DirectionWrapper>{children}</DirectionWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
