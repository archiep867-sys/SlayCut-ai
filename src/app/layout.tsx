import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SLAYCUT — Content Intelligence & Viral Video Extraction Platform',
  description:
    'Production-ready AI content intelligence platform for long-form video transcription, explainable virality scoring, persistent brand voice memory, and multi-platform growth.',
  keywords: [
    'AI video clips',
    'content intelligence',
    'viral hook generator',
    'podcast repurposing',
    'brand voice memory',
    'TikTok',
    'Instagram Reels',
    'YouTube Shorts',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-slate-100 antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
