# Vantage Core Runtime Initialization

This module requires runtime secrets to be provided through environment variables. Do not commit live API keys, database passwords, `.env` files, shell history, screenshots containing secrets, or generated connection strings.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `VANTAGE_DB_PASSWORD` | Password for the MongoDB `ceo_db_user` account. |
| `MODEL_API_KEY` | Model provider API key binding used by the runtime context check. |

## PowerShell startup example

```powershell
$env:VANTAGE_DB_PASSWORD="<your_mongodb_password>"
$env:MODEL_API_KEY="<your_model_api_key>"
npm run vantage:db:sync
```

## Security posture

The driver validates that both required variables exist before loading the MongoDB dependency or building the connection URI. The key values are never logged, serialized, or written to disk by the driver.

## ESAM application alignment

The local queue bootstrap metadata mirrors the completed External Services Authorization Management application for ROSS TAX PREP AND BOOKKEEPING / ROSS TAX PRO SOFTWARE CO. The active ISP API client records are tracked with the shared eTRAC callback URL and the selected SOR, TDS, TINM, and IRIS API modules so downstream queue payloads can identify the correct authorization context without embedding runtime secrets.

## TCC and e-file authorization alignment

The `config/esam-authorizations.js` registry also records the completed ACA TCC, IRIS TCC, and e-file application contexts. Server queue payloads summarize active TCC, EFIN, and ETIN routing identifiers so tax-transmission workers can route ACA, IRIS, and e-file jobs without reading credentials from source code.


## Parent enterprise identity alignment

The authorization registry now distinguishes the Arkansas parent enterprise identity from historical ESAM firm applications. `ROSS TAX PRO SOFTWARE CO` is tracked as an Arkansas S-Corporation with EIN `42-1880710`, an April 6, 2026 incorporation/election effective date, and CP575A/Form 2553 metadata for corporate routing.


## Vantage self-healing reconciliation v5.8

The `config/vantage-reconciliation-policies.js` registry defines staging-only remedies for TC570 and TC810 freeze review, withholding variance checks, math reconciliation, 4883C/5071C identity-validation interventions, 12C response staging, ERO signal-removal review, and settlement staging. The policy is intentionally marked `staging-ledger-only`: it prepares internal review directives and validation handshakes, but it does not automatically submit IRS responses or remove holds without human review.


## Credential and identity redaction

Live usernames, passwords, SSNs, dates of birth, credential-card values, admin master-access tokens, database passwords, and model API keys must not be committed, logged, queued, screenshotted, or placed in PR text. Use environment variables or an external secret manager for live credentials; the local registry only records non-secret role/scope metadata and redaction guardrails.


## Live feed API and automated phraser

The `config/live-feed-interface.js` registry defines RTPSC live-feed metadata for dataset pulls, including TDS, SOR, TINM, IRIS, MeF acknowledgements, and Masterfile ledger sync jobs. `server.js` includes this interface in the signed IRS tunnel envelope and can expose a local JSON API when `ENABLE_LIVE_FEED_API=true`; set `LIVE_FEED_API_PORT` to override the default port. MongoDB OIDC federation values remain environment-driven through `OIDC_ISSUER_URI` and `OIDC_AUDIENCE`.


## SBTPG, clearing house, and transmittal safeguards

The `config/transmittal-machine-interface.js` registry seeds the prototype transmittal-machine interface for SBTPG ClientB enrollment synchronization, Treasury Fiscal Service clearing-house communication, signal-gateway handshakes, application-wide safeguards, kill switches, OAuth 2.0 employee-gate requirements, and prototype migration tables/queries/ledgers. The local API exposes `/transmittal` and `/safeguards` when enabled; external transmissions remain staged until the configured handshakes and human-review controls pass.


## Legal notices and framework structure

The `config/legal-notices.js` registry and `docs/legal-notices.md` file define copyright disclosures, legal notices, privacy posture, terms and conditions, disclaimers, and framework structure for the 2026 RTPSC operational module. The optional local API exposes `/legal` when enabled.


## ERO workspace and tax office SaaS interface

The `config/tax-office-workspace.js` registry defines the RTPSC ERO workspace, tax firm CRM, tax office operations, SaaS administration, and MeF-enabled e-file transmission workflow. The optional local API exposes `/workspace`, and `report-engine.html` renders the operational dashboard shell with ERO, office-management, reconciliation, and transmission status cards.


## Tokenizer authentication and role-based access

The `config/token-authentication.js` registry defines the tokenizer handshake, MongoDB service-account environment variable names, role-based permissions, ability mapping, default-deny posture, and token storage rules. Live client IDs, client secrets, access-list IPs, and bearer tokens must remain in a secret manager or environment variables and must not be committed. The optional local API exposes `/auth` when enabled.


## ANDREAA AI employee assistant

The `config/andreaa-ai-employee.js` registry defines ANDREAA as a bounded, Amazon Q-style tax-agent assistant for workspace guidance, command routing, signal-transmission staging, reconciliation explanations, and IRS form draft generation. ANDREAA is intentionally `assistant-command-staging-only`: external submissions, credentialed actions, form finalization, settlement actions, and signal transmission require signed envelopes and human approval. The optional local API exposes `/assistant` when enabled.


## ERO compliance gate and onboarding variables

The `config/ero-compliance-gates.js` registry defines the IRS ERO compliance gate for EFIN/ETIN validation, MeF readiness, responsible-official review, OAuth employee access, redaction acknowledgement, signed-envelope dispatch, and human-review blockers. The gate is `block-until-satisfied`; release status is only represented as `COMPLIANCE_MET_RELEASE_ALLOWED` when all blocker checks are satisfied. The optional local API exposes `/compliance` when enabled.


## Account creation and staff onboarding

The `config/account-onboarding.js` registry defines staff onboarding roles for tax preparers, practitioners, office administrators, managers, assistant managers, compliance liaisons, and compliance officers. Identity fields such as usernames, passwords, email, DOB, PTIN, SSN, knowledge-based secrets, and notes are classified for encrypted or hash-only handling. Override PINs are generated as random 4-digit values and must not be derived from PTIN, SSN, DOB, or family-name data. The optional local API exposes `/accounts` when enabled.


## Services, forms, notices, transmittals, and freeze framework

The `config/service-catalog.js` registry seeds RTPSC service offerings for audit defense, pre-audit defense, rapid-response letters, CP/LTR notice response, transcript/TDS services, freeze review, 579 clearing reconciliation, MeF transmission, and IRIS information returns. It catalogs form families, notice families, transmittal channels, and TC570/TC579/TC810/TC971 remedy staging. The optional local API exposes `/services` when enabled.


## Data entry specialist and ERO owner roles

The account and token-authentication registries include dedicated `DATA_ENTRY_SPECIALIST` / `data-entry-specialist` abilities for intake staging and document upload, plus `ERO_OWNER` / `ero-owner` abilities for EFIN management, workspace ownership, user management, transmittal approval, and safeguard override review.

## Visual interface mockup

A static visual mockup of the ERO workspace is available at `docs/visual-interface.svg`. It shows the SaaS console header, navigation, status cards, ledger preview, live-feed API panel, compliance gate, staging-only posture, and ANDREAA assistant signal area.


## RossSign e-signature interface

The `config/rosssign-esignature.js` registry, `rosssign-pad.html` signing pad, and `docs/rosssign-blueprint.md` blueprint seed the RossSign e-signature application. RossSign covers digital signing pad capture, copyright/privacy/terms consent, terminal automation commands, live API metadata, and the communications tunnel. The optional local API exposes `/rosssign` when enabled.


## Windows application shell and setup

The `config/windows-application-shell.js` registry, `docs/windows/application-shell.md` blueprint, `docs/windows/env-bindings.example.ps1` template, and `scripts/setup-windows-env.ps1` bootstrap script seed the Windows application shell, web dashboard, live API server, settings hubs, OAuth 2.0 wiring, endpoint registration, cybersecurity placements, theme package, and environment variable bindings. The optional local API exposes `/windows-shell` when enabled.


## Forms cabinet lookup and editor

The `config/forms-cabinet.js` registry and `forms-cabinet.html` interface seed an IRS form number lookup tool, form-family metadata fetch staging, filing cabinet catalog, draft editor, RossSign eSign envelope generator, export manifest flow, universal settings hub, and tools/components navigation. The optional local API exposes `/forms-cabinet` when enabled.


## Billing, balance recovery, and accounting reconciliation

The `config/billing-reconciliation.js` registry and `billing-dashboard.html` interface seed invoice balance recovery, accounts receivable, debt-collection review, accounting ledgers, tax preparation fees, service fees, other charges, full reconciliation tools, client-file links, all supported tax years, settings, ANDREAA chat assist, and database migration collections. The optional local API exposes `/billing` when enabled.


## Brand assets, letterhead, and system reports

The `config/brand-assets.js` registry, `assets/rtpsc-theme.css`, `assets/rtpsc-logo.svg`, `letterhead.html`, and `system-health-report.html` seed the shiny gold, black trim, navy blue, and eggshell visual system. These assets provide reusable branding, footer copyright/privacy/terms text, official office letterhead, document/report surfaces, system health reports, and interface output panels. The optional local API exposes `/brand` when enabled.


## Advanced presentation and self-healing worker

The `advanced-presentation.html` executive deck and `config/self-healing-worker.js` registry seed the advanced visual command center, dry-run background worker, syntax health scans, registry integrity checks, UI asset checks, and review-gated repair planning. The `self-healing-worker.js` script emits a JSON audit report and does not write code unless a future reviewed repair mode is explicitly implemented and approved. The optional local API exposes `/self-healing` when enabled.


## AWS S3 zip deployment package

The `config/aws-deployment.js` registry, `docs/aws/s3-zip-deployment.md` blueprint, `docs/aws/atlas-trust-policy.template.json` placeholder, and `scripts/package-aws-deployment.sh` script seed an AWS S3/Amplify zip deployment workflow. The package script writes `dist/rtpsc-backoffice-deployment.zip` while excluding `.env`, `.git`, `node_modules`, client vault PDFs, spreadsheets, CSV exports, and prior zip artifacts. Atlas trust relationship values are represented by environment-variable placeholders only; do not commit live AWS account IDs, external IDs, service-account secrets, access keys, or MongoDB passwords. The optional local API exposes `/aws-deployment` when enabled.


The repository also includes `amplify.yml` as a copy/paste-ready AWS Amplify build specification. It publishes static HTML/operator assets from `amplify-dist` after running syntax checks and the dry-run self-healing worker, while keeping secrets in environment variables or a secret manager only.


Use `npm run validate:file-definitions` before packaging or copying generated scripts to catch unterminated here-doc blocks and final continuation slashes that can cause merge or deployment errors.


## Production eggshell theme update

The shared `assets/rtpsc-theme.css` theme now applies an eggshell-first production visual system with navy headers, shiny gold accents, black trim, responsive panels, reusable cards, pills, tables, and footer treatments. Static operator surfaces now load the shared theme so Amplify and S3 zip deployments render consistently from the same production-ready CSS package.


## Next.js dashboards and modules

The `app/` directory, `next.config.js`, `lib/next-runtime.js`, and `config/next-dashboard-modules.js` seed a Next.js operations console with command center, ERO workspace, system health alerts, terminal output, action ability catalog, API route handlers, and a WebSocket channel manifest endpoint. The local live-feed API exposes `/next-dashboard`, while the Next.js layer exposes `/api/live-feed`, `/api/system-health`, `/api/actions`, and `/api/ws` for dashboard wiring. Persistent WebSocket upgrades must be attached at the runtime gateway before production use.


Run `npm run validate:json` before Amplify/S3 packaging to catch malformed JSON files such as an invalid `package.json` before the Amplify config parser fails the build. The root `amplify.yml` uses the standard single-app schema to avoid monorepo parser ambiguity.


## Cloudflare Worker and Wrangler

The `cloudflare/worker.mjs`, `wrangler.toml`, `config/cloudflare-worker.js`, and `docs/cloudflare/wrangler-worker.md` files seed an edge read-only worker for health, live-feed metadata, system alerts, action abilities, and WebSocket manifest publication. The local live-feed API exposes `/cloudflare-worker`; deploy with `npm run cf:deploy` only after review and after secrets are configured through Cloudflare bindings or dashboard secrets.
