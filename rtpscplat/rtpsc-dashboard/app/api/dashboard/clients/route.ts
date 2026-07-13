import { NextResponse } from 'next/server';
import { clients } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ clients });
}
