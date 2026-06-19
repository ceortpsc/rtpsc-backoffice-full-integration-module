const TOKEN_AUTHENTICATION = {
    version: "1.0",
    sequenceName: "RTPSC Tokenizer Authentication Sequence",
    credentialPosture: "secret-manager-or-environment-only",
    serviceAccount: {
        provider: "MongoDB Atlas",
        organizationLabel: "Condre's Org",
        createdDate: "2026-06-15",
        clientIdEnvironmentVariable: "MONGODB_SERVICE_ACCOUNT_CLIENT_ID",
        clientSecretEnvironmentVariable: "MONGODB_SERVICE_ACCOUNT_CLIENT_SECRET",
        accessListEnvironmentVariable: "MONGODB_SERVICE_ACCOUNT_ACCESS_LIST"
    },
    handshake: [
        "load-service-account-bindings",
        "verify-access-list-source",
        "request-oauth2-token",
        "validate-token-audience-and-expiration",
        "map-token-claims-to-role",
        "enforce-ability-policy",
        "attach-signed-job-envelope"
    ],
    roles: [
        {
            role: "ero-owner",
            abilities: ["workspace:owner", "efin:manage", "jobs:approve", "ledgers:review", "transmittals:approve", "users:manage", "safeguards:override-review"]
        },
        {
            role: "owner-admin",
            abilities: ["workspace:admin", "jobs:stage", "jobs:approve", "ledgers:review", "transmittals:approve", "safeguards:manage"]
        },
        {
            role: "ero-reviewer",
            abilities: ["workspace:read", "jobs:stage", "ledgers:review", "transmittals:review"]
        },
        {
            role: "data-entry-specialist",
            abilities: ["workspace:read", "clients:create", "intake:stage", "documents:upload"]
        },
        {
            role: "office-operator",
            abilities: ["workspace:read", "clients:manage", "jobs:read", "documents:track"]
        },
        {
            role: "api-service",
            abilities: ["jobs:read", "datasets:pull", "envelopes:sign", "live-feed:publish"]
        }
    ],
    defaultDeny: true,
    tokenStoragePolicy: {
        persistTokens: false,
        redactTokensInLogs: true,
        rotateOnExposure: true,
        requireTls: true
    }
};

module.exports = { TOKEN_AUTHENTICATION };
