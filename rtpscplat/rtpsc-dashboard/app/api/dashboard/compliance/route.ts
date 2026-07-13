import { NextResponse } from 'next/server';
import { complianceAlerts } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ complianceAlerts });
}
