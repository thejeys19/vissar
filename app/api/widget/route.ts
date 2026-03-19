import { NextResponse } from 'next/server';
import { getWidgets, saveWidget, deleteWidget } from '@/lib/db';

export async function GET() {
  const widgets = await getWidgets();
  return NextResponse.json(widgets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const widget = await saveWidget(body);
  return NextResponse.json(widget);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }
  
  const success = await deleteWidget(id);
  if (!success) {
    return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
  }
  
  return NextResponse.json({ success: true });
}
