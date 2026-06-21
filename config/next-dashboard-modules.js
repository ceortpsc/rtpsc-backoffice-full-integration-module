const NEXT_DASHBOARD_MODULES = {
    version: "1.0",
    applicationName: "RTPSC Next.js Operations Console",
    posture: "review-gated-dashboard-and-api-layer",
    routes: [
        { path: "/", label: "Command Center", surface: "dashboard" },
        { path: "/workspace", label: "ERO Workspace", surface: "workspace" },
        { path: "/system-health", label: "System Health Alerts", surface: "alerts" },
        { path: "/terminal", label: "Operator Terminal", surface: "terminal-output" }
    ],
    apiEndpoints: [
        { method: "GET", path: "/api/live-feed", capability: "runtime-registry-summary" },
        { method: "GET", path: "/api/system-health", capability: "health-alerts-and-package-status" },
        { method: "GET", path: "/api/actions", capability: "action-ability-catalog" },
        { method: "GET", path: "/api/ws", capability: "websocket-channel-manifest" }
    ],
    websocketChannels: ["system.health", "queue.alerts", "worker.audit", "terminal.output", "compliance.release"],
    actionAbilities: [
        "view-system-health",
        "stage-package-build",
        "run-self-healing-dry-run",
        "review-compliance-gates",
        "open-forms-cabinet",
        "open-billing-reconciliation",
        "export-rosssign-envelope"
    ],
    guardrails: [
        "read-only-dashboard-default",
        "human-review-before-external-transmission",
        "no-secret-rendering",
        "dry-run-worker-before-repair",
        "signed-envelope-required-for-queue-actions"
    ],
    tooling: {
        nextConfig: "next.config.js",
        appDirectory: "app",
        sharedRuntime: "lib/next-runtime.js",
        websocketManifestEndpoint: "/api/ws"
    }
};

module.exports = { NEXT_DASHBOARD_MODULES };
