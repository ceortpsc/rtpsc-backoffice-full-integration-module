const runtimeSummary = {
    brand: "ROSS TAX PRO SOFTWARE CO",
    shell: "RTPSC Next.js Operations Console",
    theme: "eggshell/navy/gold",
    releaseMode: "staging-review-gated",
    dashboards: ["Command Center", "ERO Workspace", "System Health Alerts", "Operator Terminal"],
    apiEndpoints: ["/api/live-feed", "/api/system-health", "/api/actions", "/api/ws"],
    websocketChannels: ["system.health", "queue.alerts", "worker.audit", "terminal.output", "compliance.release"]
};

const actionAbilities = [
    { code: "VIEW_SYSTEM_HEALTH", label: "View system health alerts", requiresReview: false },
    { code: "STAGE_PACKAGE_BUILD", label: "Stage AWS/Amplify package build", requiresReview: true },
    { code: "RUN_SELF_HEALING_DRY_RUN", label: "Run self-healing dry-run worker", requiresReview: false },
    { code: "REVIEW_COMPLIANCE_GATES", label: "Review ERO compliance gates", requiresReview: true },
    { code: "OPEN_FORMS_CABINET", label: "Open forms cabinet", requiresReview: false },
    { code: "OPEN_BILLING_RECONCILIATION", label: "Open billing reconciliation", requiresReview: false },
    { code: "EXPORT_ROSSSIGN_ENVELOPE", label: "Export RossSign envelope", requiresReview: true }
];

const systemHealthAlerts = [
    { severity: "info", channel: "system.health", message: "Next.js dashboard shell registered", status: "ready" },
    { severity: "info", channel: "worker.audit", message: "Self-healing worker remains dry-run by default", status: "guarded" },
    { severity: "warning", channel: "compliance.release", message: "External actions require human review and signed envelope", status: "blocked-until-approved" }
];

module.exports = { runtimeSummary, actionAbilities, systemHealthAlerts };
