import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Shorty (Mongo)',
  description: 'Minimal production-grade URL shortener with MongoDB'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              Shorty
            </h1>
            <a
              href="/dashboard"
              className="text-sm text-slate-300 hover:text-white"
            >
              Dashboard
            </a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
