const WINDOWS_APPLICATION_SHELL = {
    version: "1.0",
    shellName: "RTPSC Windows Application Shell",
    posture: "web-and-desktop-staging-shell",
    applicationSurfaces: ["desktop-shell", "web-dashboard", "settings-hub", "live-api", "communications-tunnel", "terminal-tools"],
    dashboards: ["ERO Workspace", "Compliance Gates", "Services Catalog", "RossSign", "ANDREAA Assistant", "Live Feed", "Security Center"],
    settingsHubs: ["Environment Bindings", "OAuth 2.0", "API Endpoints", "Redirect URIs", "Guardrails", "Theme Packages", "Audit Footprints"],
    environmentBindings: [
        "VANTAGE_DB_PASSWORD",
        "MODEL_API_KEY",
        "ENABLE_LIVE_FEED_API",
        "LIVE_FEED_API_PORT",
        "OIDC_ISSUER_URI",
        "OIDC_AUDIENCE",
        "EMPLOYEE_OAUTH_ISSUER",
        "EMPLOYEE_OAUTH_AUDIENCE",
        "MONGODB_SERVICE_ACCOUNT_CLIENT_ID",
        "MONGODB_SERVICE_ACCOUNT_CLIENT_SECRET",
        "MONGODB_SERVICE_ACCOUNT_ACCESS_LIST",
        "RTPSC_DEPLOYMENT_BUCKET",
        "RTPSC_DEPLOYMENT_PREFIX",
        "ATLAS_AWS_ACCOUNT_ARN",
        "ATLAS_AWS_EXTERNAL_ID"
    ],
    oauth2Requirements: {
        grantTypes: ["authorization_code", "client_credentials"],
        pkceRequiredForInteractiveUsers: true,
        clientSecretRequiredForServiceAccounts: true,
        redirectUris: ["https://etrac.rosstaxsoftware.com/oauth/callback", "http://localhost:8787/oauth/callback"],
        scopes: ["openid", "profile", "email", "jobs:read", "jobs:stage", "ledgers:review", "transmittals:approve"]
    },
    endpoints: ["/health", "/live-feed", "/jobs", "/transmittal", "/workspace", "/compliance", "/accounts", "/services", "/rosssign", "/auth", "/assistant", "/legal", "/safeguards", "/windows-shell", "/aws-deployment", "/next-dashboard", "/cloudflare-worker"],
    cybersecurityPlacements: [
        "secret-manager-or-environment-only credentials",
        "OAuth 2.0 employee gate",
        "default-deny role policy",
        "signed queue envelopes",
        "redaction before logs and queues",
        "kill switches before transmittal",
        "compliance gate release before external use",
        "audit footprint capture"
    ],
    themePackages: {
        default: "rtpsc-navy-gold-eggshell",
        cssVariables: { navy: "#0F2C59", gold: "#DAC0A3", eggshell: "#F8F4EC", slate: "#1F2937" }
    },
    tooling: {
        setupScript: "scripts/setup-windows-env.ps1",
        documentation: "docs/windows/application-shell.md",
        envTemplate: "docs/windows/env-bindings.example.ps1"
    }
};

module.exports = { WINDOWS_APPLICATION_SHELL };
