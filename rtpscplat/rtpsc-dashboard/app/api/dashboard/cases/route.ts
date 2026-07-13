import { NextResponse } from 'next/server';
import { cases } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ cases });
}
