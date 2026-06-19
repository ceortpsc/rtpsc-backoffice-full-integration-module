const BILLING_RECONCILIATION = {
    version: "1.0",
    moduleName: "RTPSC Billing, Recovery, and Reconciliation",
    posture: "accounts-receivable-staging-and-review",
    billingPrograms: ["tax-preparation-fees", "service-fees", "audit-defense-fees", "transcript-service-fees", "esign-fees", "other-charges"],
    invoiceLifecycle: ["draft", "review", "issued", "partially-paid", "paid", "disputed", "recovery", "written-off"],
    balanceRecovery: {
        enabledForReview: true,
        collectionsPosture: "compliance-reviewed-communications-only",
        workflows: ["client-balance-notice", "payment-plan-staging", "fee-offset-reconciliation", "settlement-review", "write-off-review"]
    },
    accountingTools: {
        ledgers: ["accounts_receivable", "client_fees", "service_charges", "payments", "refund_transfers", "adjustments", "collections_review"],
        reconciliationChecks: ["invoice-total-vs-ledger", "fee-vs-disbursement", "payment-vs-balance", "client-file-link", "tax-year-rollforward"],
        exportFormats: ["json", "csv", "audit-manifest"]
    },
    clientFileIntegration: {
        linkFields: ["clientReference", "taxYear", "invoiceId", "serviceCode", "jobId", "documentVaultPath"],
        supportedTaxYears: ["2024", "2025", "2026", "future-rollforward"],
        managementSystems: ["forms-cabinet", "master-transcript-ledger", "rosssign", "service-catalog", "live-feed-api"]
    },
    uiUx: {
        route: "billing-dashboard.html",
        navigation: ["Invoices", "Balances", "Recovery", "Payments", "Reconciliation", "Client Files", "Settings", "AI Assist"],
        dashboards: ["A/R Summary", "Fee Recovery", "Tax Year Balances", "Client File Links", "Migration Status"]
    },
    aiAssist: {
        enabled: true,
        assistant: "ANDREAA",
        chatIntents: ["explain-balance", "draft-client-message", "summarize-ledger", "find-client-file", "prepare-recovery-review"]
    },
    databaseMigrations: {
        mode: "seeded-prototype",
        collections: ["invoices", "invoice_line_items", "payments", "balance_recovery", "client_file_links", "billing_audit_events"],
        requiresBackupBeforeRun: true
    }
};

module.exports = { BILLING_RECONCILIATION };
