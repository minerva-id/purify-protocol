import { NextResponse } from 'next/server';

// Deprecated debug endpoint — respond 404 to avoid accidental use
export async function POST() {
  return NextResponse.json({ ok: false, message: 'debug endpoint removed' }, { status: 404 });
}

