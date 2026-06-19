const SERVICE_CATALOG = {
    version: "1.0",
    catalogName: "RTPSC Fully Seeded Services Catalog",
    posture: "service-staging-and-review",
    servicesOffered: [
        { code: "AUDIT_DEFENSE", label: "Audit Defense", workflow: "notice intake, evidence ledger, response staging, reviewer approval" },
        { code: "PRE_AUDIT_DEFENSE", label: "Pre-Audit Defense", workflow: "risk scan, transcript pull, variance review, prevention packet" },
        { code: "RAPID_RESPONSE_LETTER", label: "Rapid Response Letter", workflow: "LTR/CP classifier, deadline capture, response draft, delivery review" },
        { code: "CP_LTR_RESPONSE", label: "IRS CP/LTR Notice Response", workflow: "notice family mapping, document request, form packet staging" },
        { code: "TRANSCRIPT_SERVICES", label: "Transcript and TDS Pulls", workflow: "authorization check, TDS pull, ledger sync, redacted output" },
        { code: "FREEZE_REVIEW", label: "Freeze Review and Remedy Staging", workflow: "TC570/TC810 review, identity status, withholding variance, release packet staging" },
        { code: "CLEARING_RECON", label: "579/Clearing Reconciliation", workflow: "payment clearing, offset review, settlement ledger, exception staging" },
        { code: "MEF_EFILE_TRANSMISSION", label: "MeF E-file Transmission", workflow: "schema validation, ERO review, transmit-ready staging, ack resolution" },
        { code: "IRIS_INFORMATION_RETURNS", label: "IRIS Information Returns", workflow: "1099/1042-S staging, TCC validation, transmission review" }
    ],
    noticeCoverage: {
        families: ["CP", "LTR", "12C", "4883C", "5071C", "5747C", "CP05", "CP75", "CP2000", "LTR 4464C"],
        classifierMode: "family-and-deadline-staging"
    },
    formsCoverage: {
        posture: "family-catalog-seeded",
        families: ["1040", "1041", "1065", "1120", "1120-S", "2290", "94x", "990", "1094/1095", "1099", "1042-S", "8821", "2848", "4506", "4506-T", "W-9", "W-2", "K-1"],
        generationMode: "draft-only-with-reviewer-signoff"
    },
    transmittals: {
        channels: ["MeF", "IRIS", "TDS", "SOR", "TINM", "Treasury Fiscal Service", "SBTPG"],
        requiresSignedEnvelope: true,
        requiresComplianceGateRelease: true,
        requiresHumanReview: true
    },
    freezeAndClearingFramework: {
        codes: ["TC570", "TC579", "TC810", "TC971"],
        remedies: ["math-reconciliation", "identity-validation", "withholding-variance-review", "settlement-clearing", "release-request-staging"],
        blockedUntil: ["compliance-gate-release", "reviewer-approval", "evidence-vault-complete"]
    }
};

module.exports = { SERVICE_CATALOG };
