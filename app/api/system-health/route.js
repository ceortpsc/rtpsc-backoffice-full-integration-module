const { systemHealthAlerts } = require('../../../lib/next-runtime');

export async function GET() {
  return Response.json({ ok: true, alerts: systemHealthAlerts });
}
