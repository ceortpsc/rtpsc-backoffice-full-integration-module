const { runtimeSummary } = require('../../../lib/next-runtime');

export async function GET() {
  return Response.json({ ok: true, source: 'next-live-feed', runtimeSummary });
}
