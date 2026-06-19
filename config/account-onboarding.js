const ACCOUNT_ONBOARDING = {
    version: "1.0",
    workflowName: "RTPSC Account Creation and Staff Onboarding",
    posture: "secure-identity-staging",
    roles: [
        { code: "DATA_ENTRY_SPECIALIST", label: "Data Entry Specialist", defaultAbilities: ["clients:create", "documents:upload", "intake:stage"] },
        { code: "TAX_PREPARER", label: "Tax Preparer", defaultAbilities: ["clients:read", "returns:draft", "documents:upload"] },
        { code: "TAX_PRACTITIONER", label: "Tax Practitioner", defaultAbilities: ["clients:manage", "returns:review", "notices:stage"] },
        { code: "TAX_OFFICE_ADMIN", label: "Tax Office Administrator", defaultAbilities: ["users:invite", "workspace:admin", "office:configure"] },
        { code: "TAX_OFFICE_MANAGER", label: "Tax Office Manager", defaultAbilities: ["staff:assign", "jobs:approve", "ledgers:review"] },
        { code: "ASSISTANT_MANAGER", label: "Assistant Manager", defaultAbilities: ["staff:assign", "jobs:stage", "clients:manage"] },
        { code: "COMPLIANCE_LIAISON", label: "Compliance Liaison", defaultAbilities: ["compliance:review", "evidence:collect", "notices:track"] },
        { code: "COMPLIANCE_OFFICER", label: "Compliance Officer", defaultAbilities: ["compliance:approve", "safeguards:manage", "audit:export"] },
        { code: "ERO_OWNER", label: "ERO Owner", defaultAbilities: ["workspace:owner", "efin:manage", "transmittals:approve", "users:manage", "safeguards:override-review"] }
    ],
    identityFields: [
        { name: "username", classification: "credential", storage: "unique-normalized-hash" },
        { name: "password", classification: "secret", storage: "password-hash-only" },
        { name: "email", classification: "contact", storage: "encrypted" },
        { name: "dateOfBirth", classification: "PII", storage: "encrypted-redacted-display" },
        { name: "ptin", classification: "tax-practitioner-id", storage: "encrypted-last4-display" },
        { name: "ssn", classification: "PII", storage: "encrypted-last4-display" },
        { name: "motherMaidenName", classification: "knowledge-based-secret", storage: "do-not-store-plaintext" },
        { name: "notes", classification: "operator-notes", storage: "redacted-audit-text" }
    ],
    overridePinPolicy: {
        length: 4,
        generation: "cryptographically-random-digits",
        prohibitDerivationFrom: ["PTIN", "SSN", "dateOfBirth", "motherMaidenName"],
        rotationRequiredOnExposure: true,
        reviewerApprovalRequired: true
    },
    onboardingSteps: [
        "capture-minimum-required-profile",
        "validate-email-ownership",
        "assign-role-and-abilities",
        "enable-mfa-or-oauth-employee-gate",
        "generate-random-override-pin",
        "acknowledge-redaction-and-safeguards-policy",
        "complete-compliance-review"
    ],
    accountStatus: ["invited", "identity-pending", "active", "suspended", "deactivated"]
};

module.exports = { ACCOUNT_ONBOARDING };
