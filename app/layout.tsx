import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ExpenseFlow - Modern Expense Tracker',
    template: '%s | ExpenseFlow'
  },
  description: 'Modern expense tracking for the next generation. Track, analyze, and optimize your finances with beautiful charts and insights.',
  keywords: ['expense tracker', 'finance', 'budgeting', 'money management', 'personal finance', 'analytics'],
  authors: [{ name: 'ExpenseFlow Team' }],
  creator: 'ExpenseFlow Team',
  publisher: 'ExpenseFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://expenseflow.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ExpenseFlow - Modern Expense Tracker',
    description: 'Modern expense tracking for the next generation. Track, analyze, and optimize your finances with beautiful charts and insights.',
    siteName: 'ExpenseFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExpenseFlow - Modern Expense Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExpenseFlow - Modern Expense Tracker',
    description: 'Modern expense tracking for the next generation. Track, analyze, and optimize your finances with beautiful charts and insights.',
    images: ['/og-image.png'],
    creator: '@expenseflow',
  },
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}