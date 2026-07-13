import { NextResponse } from 'next/server';
import { transmissions } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ transmissions });
}
