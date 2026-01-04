import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import DirectionWrapper from '@/components/DirectionWrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Qadaa Tracker - Track Your Missed Prayers & Fasts | متتبع القضاء',
  description:
    'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam). Track your Qadaa journey with ease. تطبيق روحاني لمساعدة المسلمين على تتبع وقضاء صلواتهم وصيامهم الفائت.',
  keywords: [
    'qadaa',
    'salah',
    'siyam',
    'prayer tracker',
    'fasting tracker',
    'islamic',
    'muslim',
    'قضاء',
    'صلاة',
    'صيام',
  ],
  authors: [{ name: 'Qadaa Tracker' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qadaa Tracker',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
                const lang = localStorage.getItem('qadaa-tracker-language') || 'en';
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = lang;
              } catch (e) {}
            `,
          }}
        />
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
