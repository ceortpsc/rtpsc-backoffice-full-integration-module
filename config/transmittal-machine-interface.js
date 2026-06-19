const TRANSMITTAL_MACHINE_INTERFACE = {
    version: "1.0",
    interfaceName: "RTPSC Transmittal Machine Interface",
    posture: "prototype-seeded-staging",
    sbtpg: {
        enrollmentInterface: "SBTPG_CLIENTB_ENROLLMENT",
        clientListSourceEnvironmentVariable: "SBTPG_CLIENT_LIST_SOURCE",
        synchronizedQueues: ["sbtpg-clientb-enrollment", "sbtpg-status-sync", "sbtpg-disbursement-recon"],
        phraserTemplates: {
            enrolled: "SBTPG enrollment staged for {clientReference} with status {status}.",
            synchronized: "SBTPG client list synchronized; records={recordCount}, variance={varianceCount}.",
            exception: "SBTPG exception requires reviewer action: {exceptionCode}."
        }
    },
    clearingHouse: {
        name: "Treasury Fiscal Service Communication Tunnel",
        channel: "TFS_CLEARING_HOUSE_TUNNEL",
        supportedMessages: ["payment-status", "offset-review", "settlement-reconciliation", "disbursement-confirmation"],
        requiresSignedEnvelope: true,
        requiresReviewerApproval: true
    },
    signalGateway: {
        handshakes: [
            "oauth2-employee-gate-valid",
            "signed-envelope-valid",
            "ledger-balance-variance-zero-or-reviewed",
            "kill-switch-open",
            "dataset-schema-valid"
        ],
        transmittalStates: ["staged", "validated", "review-required", "approved", "transmitted", "settled", "rejected"]
    },
    safeguards: {
        applicationWide: true,
        enforcedControls: [
            "least-privilege-access",
            "oauth2-employee-gate",
            "signed-job-envelope",
            "pii-redaction-before-logs",
            "human-review-for-external-transmittal",
            "immutable-audit-ledger"
        ]
    },
    killSwitches: [
        { name: "GLOBAL_TRANSMITTAL_KILL_SWITCH", environmentVariable: "GLOBAL_TRANSMITTAL_ENABLED", safeValue: "true" },
        { name: "SBTPG_SYNC_KILL_SWITCH", environmentVariable: "SBTPG_SYNC_ENABLED", safeValue: "true" },
        { name: "TFS_TUNNEL_KILL_SWITCH", environmentVariable: "TFS_TUNNEL_ENABLED", safeValue: "true" },
        { name: "IRS_PULL_KILL_SWITCH", environmentVariable: "IRS_PULLS_ENABLED", safeValue: "true" }
    ],
    oauth2EmployeeGate: {
        protocol: "OAuth 2.0",
        issuerEnvironmentVariable: "EMPLOYEE_OAUTH_ISSUER",
        audienceEnvironmentVariable: "EMPLOYEE_OAUTH_AUDIENCE",
        requiredScopes: ["jobs:read", "jobs:stage", "ledgers:review", "transmittals:approve"],
        deniedWithoutToken: true
    },
    dataMigrationSeed: {
        mode: "prototype",
        tables: ["clients", "jobs", "datasets", "ledger_entries", "transmittals", "audit_events"],
        queries: ["pending_transmittals", "ledger_variance_review", "sbtpg_sync_status", "tfs_settlement_status"],
        ledgers: ["sbtpg_clientb", "tfs_clearing_house", "irs_dataset_pulls", "settlement_reconciliation"]
    }
};

module.exports = { TRANSMITTAL_MACHINE_INTERFACE };
