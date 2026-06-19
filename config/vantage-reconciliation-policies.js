const VANTAGE_RECONCILIATION_POLICIES = {
    version: "5.8",
    posture: "staging-ledger-only",
    safeguards: {
        noAutomaticIrsSubmission: true,
        requiresHumanReviewBeforeExternalResponse: true,
        piiRedactionRequired: true,
        evidenceVaultRequired: true
    },
    validationHandshake: {
        masterfileBalanceSync: true,
        withholdingVarianceThresholdCents: 0,
        requiredSignals: [
            "account-transcript-present",
            "return-transcript-present-or-requested",
            "wage-income-transcript-present",
            "identity-validation-status-reviewed",
            "notice-response-deadline-reviewed"
        ]
    },
    freezeRemedies: [
        {
            code: "TC570",
            label: "Additional account action pending",
            stagingDirectives: [
                "reconcile assessed tax, withholding, refundable credits, and payments against the local ledger",
                "validate return processing dates and pending notice inventory before outbound contact",
                "stage supporting documents for reviewer approval when ledger variance is non-zero"
            ]
        },
        {
            code: "TC810",
            label: "Refund freeze",
            stagingDirectives: [
                "confirm identity validation status and refund claim support before escalation",
                "compare wage/income transcript withholding against return withholding lines",
                "stage release request evidence only after reviewer confirms no unresolved identity or math variance"
            ]
        }
    ],
    noticeInterventions: [
        {
            notice: "4883C",
            category: "identity-validation",
            preventionDirectives: [
                "verify taxpayer identity workflow status before refund-release staging",
                "capture completion evidence in the reconciliation ledger"
            ]
        },
        {
            notice: "5071C",
            category: "identity-validation",
            preventionDirectives: [
                "flag unresolved online identity verification before ERO signal removal staging",
                "hold settlement staging until identity status is reviewer-cleared"
            ]
        },
        {
            notice: "12C",
            category: "missing-information-response",
            preventionDirectives: [
                "map requested forms or schedules to source documents",
                "stage response packet with reviewer signoff and delivery deadline"
            ]
        }
    ],
    reconciliationLedgers: [
        "math-reconciliation",
        "withholding-variance",
        "credit-validation",
        "identity-validation",
        "notice-response",
        "settlements-staging"
    ],
    eroSignalRemoval: {
        enabledForStaging: true,
        directives: [
            "remove internal ERO hold signals only after transcript, identity, notice, and variance checks pass",
            "record reviewer, timestamp, source evidence, and variance hash in the staging ledger"
        ]
    }
};

module.exports = { VANTAGE_RECONCILIATION_POLICIES };
