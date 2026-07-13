import { NextResponse } from 'next/server';
import { reconciliation } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ reconciliation });
}
