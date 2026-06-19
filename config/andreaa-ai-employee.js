const ANDREAA_AI_EMPLOYEE = {
    version: "1.0",
    agentName: "ANDREAA",
    role: "Tax Agent AI Employee",
    posture: "assistant-command-staging-only",
    learningMode: {
        style: "Amazon Q-style contextual assistant",
        selfLearning: "bounded-memory-from-approved-knowledge-bases",
        requiresHumanApprovalForNewRules: true,
        trainingDataSources: ["approved firm SOPs", "runtime registries", "reviewed audit outcomes", "non-secret operational metadata"]
    },
    abilities: [
        "workspace-guidance",
        "client-intake-triage",
        "dataset-pull-recommendations",
        "reconciliation-explanation",
        "notice-response-staging",
        "irs-form-generation-staging",
        "command-routing",
        "signal-transmission-staging",
        "audit-summary-drafting"
    ],
    commandExecutor: {
        enabledForStaging: true,
        blockedCommands: ["external-submit", "credential-export", "secret-print", "irs-live-transmit-without-review"],
        requiresSignedEnvelope: true,
        requiresHumanApprovalFor: ["IRS form finalization", "external transmission", "settlement action", "credentialed portal action"]
    },
    signalTransmitter: {
        channel: "ANDREAA_SIGNAL_TRANSMITTER",
        supportedSignals: ["job-intent", "form-generation-request", "review-required", "transmit-ready", "reconciliation-alert"],
        emitsToQueues: ["assistant-commands", "forms-staging", "review-gates", "signal-audit"]
    },
    irsFormsGeneration: {
        mode: "draft-staging-only",
        supportedFamilies: ["8821", "2848", "1040 support packets", "1120-S support packets", "1094/1095 support packets", "1099/IRIS support packets", "notice response cover sheets"],
        outputRequirements: ["source-document mapping", "reviewer signoff", "redaction check", "delivery deadline check", "audit hash"]
    },
    apiServer: {
        endpoints: [
            { method: "GET", path: "/assistant", purpose: "ANDREAA AI employee metadata and command policy" },
            { method: "POST", path: "/assistant/commands", purpose: "future command intake endpoint; staging policy only" }
        ]
    }
};

module.exports = { ANDREAA_AI_EMPLOYEE };
