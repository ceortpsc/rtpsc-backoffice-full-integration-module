const { runtimeSummary } = require('../../../lib/next-runtime');

export async function GET() {
  return Response.json({
    ok: true,
    websocketUpgrade: 'register-at-runtime-gateway',
    channels: runtimeSummary.websocketChannels,
    note: 'Next.js route handlers publish the channel manifest; attach a Node/WebSocket gateway in runtime infrastructure for persistent sockets.'
  });
}
