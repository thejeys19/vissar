import { NextResponse } from 'next/server';
import { getWidgets, saveWidget, deleteWidget } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || session?.user?.email;
    
    const widgets = await getWidgets();
    // Return only user's widgets if authenticated
    const filtered = userId ? widgets.filter(w => w.userId === userId || !w.userId) : widgets;
    return NextResponse.json(filtered);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('GET /api/widget error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || session?.user?.email;
    
    const body = await request.json();
    const widget = await saveWidget({ ...body, userId });
    return NextResponse.json(widget);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('POST /api/widget error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
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
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('DELETE /api/widget error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
