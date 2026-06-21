# RTPSC Cloudflare Worker / Wrangler Blueprint

This blueprint adds an edge-ready Cloudflare Worker for read-only runtime metadata, system health alerts, action ability catalog, and WebSocket channel manifest publication.

## Local commands

```bash
npm run cf:check
npm run cf:dev
```

## Deploy after review

```bash
npm run cf:deploy
```

## Guardrails

- Keep secrets in Cloudflare dashboard secrets or environment bindings, never in `wrangler.toml`.
- The worker is read-only by default and does not perform IRS, MongoDB, billing, or queue write actions.
- Persistent WebSockets should be implemented through Durable Objects or a runtime gateway before production use.
- Deployment requires human review and signed release approval.
