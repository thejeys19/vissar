import { NextResponse } from 'next/server';
import { getWidget, deleteWidget } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const widget = await getWidget(id);
  
  if (!widget) {
    return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
  }
  
  return NextResponse.json(widget);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await deleteWidget(id);
  
  if (!success) {
    return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
  }
  
  return NextResponse.json({ success: true });
}
