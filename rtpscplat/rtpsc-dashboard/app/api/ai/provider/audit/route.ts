import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.RTP_API_BASE_URL || 'http://127.0.0.1:8080';

export async function GET(request: NextRequest) {
    try {
        const upstreamUrl = new URL(`${API_BASE}/api/ai/provider/audit`);
        request.nextUrl.searchParams.forEach((value, key) => {
            upstreamUrl.searchParams.set(key, value);
        });

        const response = await fetch(upstreamUrl, { cache: 'no-store' });
        const payload = await response.json().catch(() => ({ error: 'UPSTREAM_INVALID_JSON' }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'AI_PROXY_REQUEST_FAILED' },
            { status: 500 }
        );
    }
}