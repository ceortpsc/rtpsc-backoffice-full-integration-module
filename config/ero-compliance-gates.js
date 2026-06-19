const ERO_COMPLIANCE_GATES = {
    version: "1.0",
    gateName: "IRS ERO Compliance Gate",
    posture: "block-until-satisfied",
    officeConfigurationVariables: [
        "ERO_OFFICE_ID",
        "ERO_OFFICE_NAME",
        "ERO_EFIN",
        "ERO_ETIN_TRANSMITTER",
        "ERO_ETIN_ONLINE_PROVIDER",
        "ERO_ETIN_SOFTWARE_DEVELOPER",
        "ERO_RESPONSIBLE_OFFICIAL",
        "ERO_COMPLIANCE_REVIEWER",
        "ERO_MEF_ENABLED",
        "ERO_ONBOARDING_STATUS"
    ],
    validationChecks: [
        { code: "EFIN_ACTIVE", label: "EFIN active and mapped to office", blocker: true },
        { code: "ETIN_TRANSMITTER_ACTIVE", label: "Transmitter ETIN active", blocker: true },
        { code: "ETIN_SOFTWARE_DEVELOPER_ACTIVE", label: "Software Developer ETIN active", blocker: true },
        { code: "MEF_TRANSMISSION_STATUS_READY", label: "MeF transmission status reviewed", blocker: true },
        { code: "ERO_SUITABILITY_COMPLETE", label: "ERO suitability and responsible official validation complete", blocker: true },
        { code: "OAUTH_EMPLOYEE_GATE_ENABLED", label: "OAuth employee access gate enabled", blocker: true },
        { code: "REDACTION_POLICY_ACKNOWLEDGED", label: "Redaction and privacy controls acknowledged", blocker: true },
        { code: "SIGNED_ENVELOPE_REQUIRED", label: "Signed envelope required for dispatch and transmission", blocker: true },
        { code: "HUMAN_REVIEW_GATE_ENABLED", label: "Human review required before external submission", blocker: true }
    ],
    releaseRule: {
        statusWhenSatisfied: "COMPLIANCE_MET_RELEASE_ALLOWED",
        statusWhenBlocked: "COMPLIANCE_BLOCKED_REVIEW_REQUIRED",
        requiresAllBlockersSatisfied: true,
        releaseAbilities: ["mef-transmit-ready", "dataset-pull-ready", "settlement-review-ready", "assistant-form-draft-ready"]
    },
    onboardingWorkflow: [
        "collect-office-configuration",
        "validate-efin-etin-mappings",
        "confirm-responsible-official",
        "enable-oauth-employee-gate",
        "acknowledge-redaction-policy",
        "verify-signed-envelope-dispatch",
        "complete-human-review-gate",
        "mark-compliance-met"
    ]
};

module.exports = { ERO_COMPLIANCE_GATES };
