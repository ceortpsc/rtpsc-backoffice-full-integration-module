const SELF_HEALING_WORKER = {
    version: "1.0",
    workerName: "RTPSC Self-Healing Background Worker",
    posture: "diagnose-plan-review-before-repair",
    capabilities: ["syntax-health-scan", "registry-integrity-check", "ui-asset-presence-check", "api-endpoint-catalog-check", "repair-plan-generation"],
    prohibitedActions: ["unreviewed-code-write", "secret-modification", "external-deployment", "live-transmission", "dependency-upgrade-without-review"],
    workerScript: "self-healing-worker.js",
    runModes: ["dry-run", "plan-only", "review-approved-repair"],
    backgroundQueues: ["code-health", "asset-health", "registry-health", "api-health"],
    repairPolicy: {
        defaultMode: "dry-run",
        requiresHumanApproval: true,
        requiresCleanGitWorktree: true,
        requiresBackupManifest: true,
        emitsAuditReport: true
    },
    presentation: {
        route: "advanced-presentation.html",
        theme: "million-dollar navy/gold/eggshell executive deck",
        panels: ["Runtime Command Center", "Self-Healing Worker", "Live API", "Compliance Gates", "RossSign", "Billing", "Forms Cabinet"]
    }
};

module.exports = { SELF_HEALING_WORKER };
