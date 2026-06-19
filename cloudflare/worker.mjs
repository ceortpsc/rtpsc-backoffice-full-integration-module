const json = (payload, init = {}) => new Response(JSON.stringify(payload, null, 2), {
  status: init.status || 200,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...init.headers
  }
});

const runtime = {
  service: 'rtpsc-cloudflare-worker',
  posture: 'edge-read-only-live-feed-proxy',
  dashboards: ['command-center', 'workspace', 'system-health', 'terminal'],
  endpoints: ['/health', '/live-feed', '/system-health', '/actions', '/ws-manifest'],
  guardrails: ['no-secret-rendering', 'read-only-default', 'signed-envelope-before-external-transmission']
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return json({ ok: true, runtime: runtime.service, environment: env.ENVIRONMENT || 'staging' });
    }

    if (url.pathname === '/live-feed') {
      return json({ ok: true, source: 'cloudflare-worker', runtime });
    }

    if (url.pathname === '/system-health') {
      return json({ ok: true, alerts: [
        { severity: 'info', channel: 'edge.health', message: 'Cloudflare Worker edge route online', status: 'ready' },
        { severity: 'warning', channel: 'edge.guardrail', message: 'External actions remain review-gated', status: 'blocked-until-approved' }
      ] });
    }

    if (url.pathname === '/actions') {
      return json({ ok: true, actions: [
        { code: 'EDGE_VIEW_HEALTH', label: 'View edge health', requiresReview: false },
        { code: 'EDGE_PROXY_LIVE_FEED', label: 'Proxy live-feed metadata', requiresReview: false },
        { code: 'EDGE_STAGE_DEPLOYMENT', label: 'Stage Cloudflare deployment', requiresReview: true }
      ] });
    }

    if (url.pathname === '/ws-manifest') {
      return json({ ok: true, websocketUpgrade: 'durable-object-or-runtime-gateway-required', channels: ['edge.health', 'queue.alerts', 'worker.audit', 'terminal.output'] });
    }

    return json({ ok: false, error: 'not_found', supportedEndpoints: runtime.endpoints }, { status: 404 });
  }
};
