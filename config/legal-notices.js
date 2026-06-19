const LEGAL_NOTICES = {
    version: "1.0",
    effectiveYear: 2026,
    owner: "ROSS TAX PRO SOFTWARE CO",
    module: "rtpsc-backoffice-full-integration-module",
    copyright: {
        notice: "Copyright (c) 2026 ROSS TAX PRO SOFTWARE CO. All rights reserved.",
        scope: "Application framework, runtime registries, queue envelopes, API metadata, documentation, and integration structure."
    },
    disclosures: [
        "This software is an internal operational framework and does not replace professional tax, legal, accounting, or cybersecurity advice.",
        "IRS, Treasury, MongoDB, SBTPG, and other third-party names identify integration contexts only and do not imply endorsement.",
        "External transmissions, notice responses, settlement actions, and credentialed service access require authorized human review before submission."
    ],
    privacy: {
        posture: "data-minimization-and-redaction",
        protectedDataClasses: ["PII", "tax-return-information", "credentials", "OAuth tokens", "API keys", "transcript data"],
        requirements: [
            "collect only the minimum data needed for the workflow",
            "redact protected data from logs, screenshots, queue summaries, and PR messages",
            "store live secrets only in approved environment variables or external secret managers",
            "retain audit evidence according to the applicable business retention schedule"
        ]
    },
    termsAndConditions: {
        accessModel: "authorized-users-only",
        acceptableUse: [
            "use the module only for authorized business operations",
            "do not bypass kill switches, reviewer gates, or OAuth employee-gate controls",
            "do not use staged metadata as proof that an external filing, response, or transmission was submitted",
            "verify all taxpayer, client, and settlement data against source records before action"
        ],
        warrantyDisclaimer: "Provided as an internal integration framework without warranties of uninterrupted operation, error-free processing, or regulatory sufficiency.",
        limitation: "Operators remain responsible for validating outputs, compliance obligations, credentials, and external submissions."
    },
    frameworkStructure: {
        registries: ["ESAM authorizations", "live feed", "security redaction", "transmittal machine", "reconciliation", "legal notices"],
        runtimeSurfaces: ["signed queue envelope", "optional local JSON API", "MongoDB connectivity driver", "filesystem fallback"],
        reviewGates: ["human-review", "OAuth2 employee gate", "kill-switch checks", "signed-envelope validation"]
    }
};

module.exports = { LEGAL_NOTICES };
