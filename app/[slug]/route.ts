import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Link from '@/models/Link';
import ClickEvent from '@/models/ClickEvent';
import { getClientInfo } from '@/lib/client-info';

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  const slug = params.slug;

  await connectDB();

  const link = await Link.findOne({ shortCode: slug }).lean();

  if (!link || (link.expiresAt && new Date(link.expiresAt) < new Date())) {
    return new NextResponse('<h1>Link not found</h1>', {
      status: 404,
      headers: { 'content-type': 'text/html' }
    });
  }

  const { referrer, userAgent, ipHash, country } = getClientInfo(req);

  ClickEvent.create({
    linkId: link._id,
    referrer,
    userAgent,
    ipHash,
    country
  }).catch(() => {});

  Link.updateOne(
    { _id: link._id },
    { $inc: { clickCount: 1 } }
  ).catch(() => {});

  return NextResponse.redirect(link.longUrl as string, 302);
};
