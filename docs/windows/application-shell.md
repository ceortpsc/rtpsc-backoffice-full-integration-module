# RTPSC Windows Application Shell Blueprint

This blueprint wires the web-based dashboard, optional live API server, terminal setup script, OAuth 2.0 bindings, settings hubs, cybersecurity placements, and RTPSC theme package for Windows operators.

## Setup

1. Copy `scripts/setup-windows-env.ps1` to a secure local working directory.
2. Replace placeholders with values from the approved secret manager.
3. Run the script in PowerShell for the current session.
4. Start the local live API with `node .\server.js`.

## Safeguards

- Do not commit live credentials, tokens, client secrets, access-list IPs, or generated `.env` files.
- OAuth 2.0 and OIDC issuer/audience values must match the configured identity provider.
- External transmittals remain gated by signed envelopes, kill switches, compliance release, and human review.
