const TAX_OFFICE_WORKSPACE = {
    version: "1.0",
    workspaceName: "RTPSC ERO Workspace",
    productClass: "Tax office management SaaS",
    mefEnabled: true,
    modules: [
        { code: "ERO_DASHBOARD", label: "ERO Workspace", capability: "firm-level work queue, reviewer gates, ERO owner controls, and EFIN status" },
        { code: "TAXFIRM_CRM", label: "TaxFirm Client Management", capability: "data-entry intake, client records, document status, and communication tracking" },
        { code: "OFFICE_OPS", label: "Tax Office Operations", capability: "staff assignments, compliance tasks, and office throughput" },
        { code: "EFILING", label: "E-file Transmission", capability: "MeF-enabled transmission staging, acknowledgement review, and rejection routing" },
        { code: "SAAS_ADMIN", label: "SaaS Administration", capability: "tenant controls, employee access, OAuth gates, and audit posture" },
        { code: "ANDREAA_AI", label: "ANDREAA AI Employee", capability: "assistant command staging, form draft generation, and review-gated signal transmission" }
    ],
    uiUx: {
        theme: { navy: "#0F2C59", gold: "#DAC0A3", eggshell: "#F8F4EC" },
        navigation: ["Dashboard", "Clients", "Transmissions", "Reconciliation", "Office", "Safeguards"],
        statusCards: ["MeF Enabled", "ERO Workspace", "Office Management", "SaaS Controls", "Human Review Gates", "ANDREAA AI"]
    },
    transmissionWorkflow: {
        channel: "IRS_MEF_TRANSMISSION",
        stages: ["intake", "validation", "review", "transmit-ready", "submitted", "acknowledged", "resolved"],
        requiresHumanReviewBeforeSubmit: true,
        acknowledgementQueues: ["mef-acks", "rejection-routing", "settlement-reconciliation"]
    }
};

module.exports = { TAX_OFFICE_WORKSPACE };
