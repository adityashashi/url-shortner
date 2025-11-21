import crypto from 'crypto';

export function getClientInfo(req: Request) {
  const headers = new Headers(req.headers);
  const referrer = headers.get('referer') ?? undefined;
  const userAgent = headers.get('user-agent') ?? undefined;

  const ip =
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    headers.get('x-real-ip') ??
    '0.0.0.0';

  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

  const country = headers.get('x-vercel-ip-country') ?? undefined;

  return { referrer, userAgent, ipHash, country };
}
