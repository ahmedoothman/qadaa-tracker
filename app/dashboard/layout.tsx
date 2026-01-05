import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Track Your Qadaa Progress',
  description:
    'Your personal dashboard to track and make up missed prayers (Salah) and fasts (Siyam). Monitor your progress and stay motivated on your spiritual journey.',
  openGraph: {
    title: 'Qadaa Tracker Dashboard',
    description:
      'Track your missed prayers and fasts progress. Monitor your spiritual journey.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
