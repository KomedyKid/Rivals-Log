import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';

export const metadata: Metadata = {
  title: 'Rivals Log',
  description: 'Unmask Your Opponents.',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics /> {/* This should be inside <body> */}
      </body>
    </html>
  );
}
