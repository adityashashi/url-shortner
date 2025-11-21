import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Link from '@/models/Link';
import { encodeBase62 } from '@/lib/base62';

export const POST = async (req: Request) => {
  await connectDB();

  const body = await req.json();
  const { longUrl, customCode } = body as {
    longUrl?: string;
    customCode?: string;
  };

  if (!longUrl) {
    return NextResponse.json({ error: 'longUrl is required' }, { status: 400 });
  }

  try {
    const url = new URL(longUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return NextResponse.json({ error: 'Only http/https allowed' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (customCode) {
    const exists = await Link.findOne({ shortCode: customCode }).lean();
    if (exists) {
      return NextResponse.json({ error: 'Code already in use' }, { status: 409 });
    }
  }

  const count = await Link.estimatedDocumentCount();
  const generated = encodeBase62(count + 1);
  const finalCode = customCode || generated;

  const created = await Link.create({
    longUrl,
    shortCode: finalCode
  });

  return NextResponse.json(
    {
      id: created._id.toString(),
      shortCode: created.shortCode
    },
    { status: 201 }
  );
};

export const GET = async () => {
  await connectDB();

  const links = await Link.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(links);
};
