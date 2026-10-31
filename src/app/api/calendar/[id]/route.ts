import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, scheduledFor, captionUsed } = body;

    const item = await prisma.contentCalendarItem.update({
      where: { id: params.id },
      data: {
        status: status !== undefined ? status : undefined,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        captionUsed: captionUsed !== undefined ? captionUsed : undefined,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating calendar item:', error);
    return NextResponse.json({ error: 'Failed to update calendar item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.contentCalendarItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting calendar item:', error);
    return NextResponse.json({ error: 'Failed to delete calendar item' }, { status: 500 });
  }
}
