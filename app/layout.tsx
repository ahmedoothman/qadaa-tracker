import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Qadaa Tracker - Track Your Missed Prayers & Fasts',
  description:
    'A spiritual companion app to help Muslims track and make up their missed prayers (Salah) and fasts (Siyam). Track your Qadaa journey with ease.',
  keywords: [
    'qadaa',
    'salah',
    'siyam',
    'prayer tracker',
    'fasting tracker',
    'islamic',
    'muslim',
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
  themeColor: '#2D5F5D',
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
    <html lang='en'>
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
