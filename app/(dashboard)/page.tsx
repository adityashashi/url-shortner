import { connectDB } from '@/lib/mongoose';
import LinkModel from '@/models/Link';

export const dynamic = 'force-dynamic';

async function getLinks() {
  await connectDB();
  const links = await LinkModel.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return links.map((l: any) => ({
    id: l._id.toString(),
    shortCode: l.shortCode,
    longUrl: l.longUrl,
    clickCount: l.clickCount,
    createdAt: l.createdAt
  }));
}

export default async function DashboardPage() {
  const links = await getLinks();

  return (
    <main>
      <h2 className="text-xl font-semibold mb-4">Links</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Short</th>
              <th className="px-3 py-2 text-left">Target</th>
              <th className="px-3 py-2 text-left">Clicks</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-t border-slate-800">
                <td className="px-3 py-2">
                  <a
                    href={`/${l.shortCode}`}
                    className="text-blue-400 hover:underline"
                  >
                    /{l.shortCode}
                  </a>
                </td>
                <td className="px-3 py-2 max-w-xs truncate">
                  {l.longUrl}
                </td>
                <td className="px-3 py-2">
                  {l.clickCount}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {l.createdAt
                    ? new Date(l.createdAt).toISOString().split('T')[0]
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
