const ROSSSIGN_ESIGNATURE = {
    version: "1.0",
    applicationName: "RossSign",
    posture: "esignature-staging-and-consent-capture",
    blueprint: {
        surfaces: ["digital-signing-pad", "terminal-automation", "live-api-server", "communications-tunnel"],
        signedEnvelopeRequired: true,
        auditTrailRequired: true,
        humanReviewRequiredBeforeExternalUse: true
    },
    signingPad: {
        route: "rosssign-pad.html",
        inputMode: "canvas-pointer-touch",
        outputMode: "base64-png-staging",
        requiredConsents: ["copyright", "privacy", "terms-of-service", "electronic-signature-consent"]
    },
    legalDocuments: {
        copyrightNotice: "Copyright (c) 2026 ROSS TAX PRO SOFTWARE CO. All rights reserved.",
        privacyDocument: "docs/legal-notices.md#privacy",
        termsDocument: "docs/legal-notices.md#terms-and-conditions",
        consentText: "By signing, the signer consents to electronic signature capture for the staged RTPSC workflow and acknowledges review requirements before external submission."
    },
    terminalAutomation: {
        enabledForLocalOperators: true,
        commands: ["rosssign:stage", "rosssign:verify", "rosssign:audit"],
        prohibited: ["silent-sign", "signature-replay", "external-submit-without-review"]
    },
    communicationsTunnel: {
        channel: "ROSSSIGN_COMMUNICATIONS_TUNNEL",
        liveApiEndpoint: "/rosssign",
        emitsToQueues: ["esignature-staging", "signature-audit", "review-gates"],
        requiresRedaction: true
    }
};

module.exports = { ROSSSIGN_ESIGNATURE };
