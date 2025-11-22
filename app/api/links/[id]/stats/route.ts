import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Link from '@/models/Link';
import ClickEvent from '@/models/ClickEvent';
import { Types } from 'mongoose';

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const link = await Link.findById(params.id);

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const linkId = link._id as any;

  const recentClicks = await ClickEvent.find({ linkId: link._id })
    .sort({ clickedAt: -1 })
    .limit(100)
    .lean();

  const byDayAgg = await ClickEvent.aggregate([
    { $match: { linkId: link._id } },
    {
      $group: {
        _id: {
          y: { $year: '$clickedAt' },
          m: { $month: '$clickedAt' },
          d: { $dayOfMonth: '$clickedAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
  ]);

  return NextResponse.json({
    id: link._id.toString(),
    shortCode: link.shortCode,
    longUrl: link.longUrl,
    clickCount: link.clickCount,
    recentClicks,
    byDay: byDayAgg
  });
};
