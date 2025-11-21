'use client';

import { FormEvent, useState } from 'react';

export default function HomePage() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setLoading(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl, customCode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      const url =
        typeof window !== 'undefined'
          ? `${window.location.origin}/${data.shortCode}`
          : `/${data.shortCode}`;

      setShortUrl(url);
      setLongUrl('');
      setCustomCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="mb-8">
        <p className="text-slate-300">
          Paste a long URL and get a short link with basic click analytics.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-900 border border-slate-800 rounded-xl p-4"
      >
        <div>
          <label className="block text-sm mb-1" htmlFor="longUrl">
            Long URL
          </label>
          <input
            id="longUrl"
            type="url"
            required
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="customCode">
            Custom back-half (optional)
          </label>
          <input
            id="customCode"
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-link"
            className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Shortening…' : 'Shorten URL'}
        </button>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {shortUrl && (
          <p className="text-sm text-emerald-400">
            Short URL:{' '}
            <a href={shortUrl} className="underline">
              {shortUrl}
            </a>
          </p>
        )}
      </form>
    </main>
  );
}
