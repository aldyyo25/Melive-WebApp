import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Providers } from '@/components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Live Stream Audience',
  description: 'Watch live streams from broadcasters',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Live Stream Audience</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
              <Link href="/demo" className="hover:text-gray-300">
                Demo
              </Link>
            </div>
          </div>
        </nav>
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
