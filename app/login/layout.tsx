import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Sign In to Your Account',
  description:
    'Sign in to Qadaa Tracker to access your prayer and fasting tracker. Continue your spiritual journey and track your missed prayers (Salah) and fasts (Siyam).',
  openGraph: {
    title: 'Login to Qadaa Tracker',
    description:
      'Sign in to access your prayer and fasting tracker. Continue your spiritual journey.',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
