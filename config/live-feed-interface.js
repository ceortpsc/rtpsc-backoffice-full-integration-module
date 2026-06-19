const LIVE_FEED_INTERFACE = {
    version: "1.0",
    interfaceName: "RTPSC Live Feed Interface",
    apiServer: {
        enabledByEnvironmentVariable: "ENABLE_LIVE_FEED_API",
        defaultPort: 8787,
        endpoints: [
            { method: "GET", path: "/health", purpose: "runtime health handshake" },
            { method: "GET", path: "/live-feed", purpose: "current live-feed interface metadata" },
            { method: "GET", path: "/jobs", purpose: "available job and dataset pull catalog" },
            { method: "GET", path: "/transmittal", purpose: "transmittal machine interface catalog" },
            { method: "GET", path: "/safeguards", purpose: "application-wide safeguards and kill switches" },
            { method: "GET", path: "/legal", purpose: "legal notices, privacy, terms, and framework structure" },
            { method: "GET", path: "/workspace", purpose: "ERO workspace and tax office SaaS interface" },
            { method: "GET", path: "/auth", purpose: "tokenizer authentication and role ability policy" },
            { method: "GET", path: "/assistant", purpose: "ANDREAA AI employee assistant interface" },
            { method: "GET", path: "/compliance", purpose: "IRS ERO EFIN/ETIN compliance gate and onboarding variables" },
            { method: "GET", path: "/accounts", purpose: "staff account creation roles and identity safeguards" },
            { method: "GET", path: "/services", purpose: "seeded services, forms, notice, transmittal, and freeze framework catalog" },
            { method: "GET", path: "/rosssign", purpose: "RossSign e-signature blueprint and communications tunnel metadata" },
            { method: "GET", path: "/windows-shell", purpose: "Windows app shell setup, OAuth wiring, settings hubs, and cybersecurity placements" },
            { method: "GET", path: "/forms-cabinet", purpose: "IRS form lookup, filing cabinet, editor, and eSign envelope catalog" },
            { method: "GET", path: "/billing", purpose: "invoice balance recovery, accounting reconciliation, and billing dashboards" },
            { method: "GET", path: "/brand", purpose: "brand assets, colors, logos, letterhead, footers, and health report surfaces" },
            { method: "GET", path: "/self-healing", purpose: "self-healing worker, background checks, and repair policy metadata" },
            { method: "GET", path: "/aws-deployment", purpose: "AWS S3 zip deployment, Atlas trust policy, and Amplify packaging metadata" },
            { method: "GET", path: "/next-dashboard", purpose: "Next.js dashboard modules, websocket channels, endpoints, and action abilities" }
        ]
    },
    mongodbFederation: {
        configurationName: "RTPSC",
        configurationDescription: "RTPSC DEPLOYMENT",
        protocol: "OIDC",
        issuerUriEnvironmentVariable: "OIDC_ISSUER_URI",
        audienceEnvironmentVariable: "OIDC_AUDIENCE"
    },
    jobDatasets: [
        { code: "TDS_TRANSCRIPT_PULL", label: "TDS transcript pull", source: "IRS_TDS", queue: "tds-pulls" },
        { code: "SOR_STATUS_PULL", label: "Secure Object Repository status pull", source: "IRS_SOR", queue: "sor-pulls" },
        { code: "TINM_VALIDATION_PULL", label: "TIN matching validation pull", source: "IRS_TINM", queue: "tinm-pulls" },
        { code: "IRIS_TRANSMISSION_PULL", label: "IRIS transmission status pull", source: "IRS_IRIS", queue: "iris-pulls" },
        { code: "MEF_ACK_PULL", label: "MeF acknowledgement pull", source: "IRS_MEF", queue: "mef-acks" },
        { code: "MASTERFILE_LEDGER_SYNC", label: "Masterfile reconciliation ledger sync", source: "IRS_TRANSCRIPTS", queue: "masterfile-sync" }
    ],
    automatedPhraser: {
        defaultSeverity: "info",
        templates: {
            queued: "{jobCode} queued for {datasetLabel} via {source}.",
            pulling: "{jobCode} fetching {datasetLabel} from {source}.",
            reconciled: "{jobCode} reconciled {datasetLabel}; variance={varianceCents} cents.",
            intervention: "{jobCode} requires reviewer intervention for {noticeOrFreezeCode} before outbound action."
        }
    },
    irsTunnel: {
        channel: "IRS_ESAM_TUNNEL",
        supportsDatasetPulls: true,
        supportedPullTypes: ["TDS", "SOR", "TINM", "IRIS", "MEF", "MASTERFILE"],
        requiresSignedEnvelope: true
    }
};

module.exports = { LIVE_FEED_INTERFACE };
