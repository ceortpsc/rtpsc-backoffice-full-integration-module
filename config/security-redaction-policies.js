const SECURITY_REDACTION_POLICIES = {
    version: "1.0",
    credentialPosture: "environment-only",
    prohibitedSecretClasses: [
        "account-username",
        "account-password",
        "social-security-number",
        "date-of-birth",
        "irs-credential-card-data",
        "admin-master-access-token",
        "database-password",
        "model-api-key"
    ],
    requiredRuntimeBindings: [
        "VANTAGE_DB_PASSWORD",
        "MODEL_API_KEY"
    ],
    redactionTokens: {
        username: "[REDACTED_USERNAME]",
        password: "[REDACTED_PASSWORD]",
        ssn: "[REDACTED_SSN]",
        dateOfBirth: "[REDACTED_DOB]",
        credentialCard: "[REDACTED_CREDENTIAL_CARD]",
        adminSecret: "[REDACTED_ADMIN_SECRET]"
    },
    operatorRoles: [
        "ceo",
        "ero-owner",
        "admin"
    ],
    accessScope: {
        efin: "748335",
        role: "ero-owner-admin",
        permissions: ["master-ledger-review", "reconciliation-staging", "evidence-vault-review"]
    },
    guardrails: [
        "never commit live usernames, passwords, SSNs, dates of birth, credential card values, or API keys",
        "load credentials only from approved environment variables or an external secret manager",
        "redact sensitive identity fields before logging, queue dispatch, screenshots, or PR text",
        "require human approval before using administrator credentials for external service access"
    ]
};

module.exports = { SECURITY_REDACTION_POLICIES };
