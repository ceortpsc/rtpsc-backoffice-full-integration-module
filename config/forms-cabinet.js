const FORMS_CABINET = {
    version: "1.0",
    cabinetName: "RTPSC Forms Cabinet",
    posture: "metadata-lookup-draft-edit-export",
    formLookupTool: {
        supportsNumberSearch: true,
        supportsFamilySearch: true,
        fetchSources: ["irs.gov/forms-instructions", "local-template-cabinet", "reviewed-firm-packets"],
        fetchMode: "metadata-and-template-staging",
        supportedFamilies: ["1040", "1041", "1065", "1120", "1120-S", "2290", "94x", "990", "1094/1095", "1099", "1042-S", "8821", "2848", "4506", "4506-T", "W-2", "W-9", "K-1"]
    },
    filingCabinet: {
        root: "forms-cabinet",
        drawers: ["client-intake", "authorizations", "transcripts", "notice-responses", "entity-returns", "information-returns", "esign-envelopes", "exports"],
        indexFields: ["formNumber", "taxYear", "clientReference", "status", "reviewer", "deadline", "envelopeId"]
    },
    editorInterface: {
        route: "forms-cabinet.html",
        modes: ["lookup", "draft", "review", "esign-envelope", "export"],
        requiresAutosave: true,
        requiresRedactionBeforeExport: true
    },
    esignEnvelope: {
        generator: "RossSign envelope generator",
        envelopeStatuses: ["draft", "sent-for-review", "signed", "void", "exported"],
        exportFormats: ["json", "pdf-packet-staging", "audit-manifest"],
        requiresConsent: true,
        requiresAuditHash: true
    },
    universalTools: ["form-number-lookup", "cabinet-search", "draft-editor", "esign-envelope-builder", "export-manifest", "settings-hub"]
};

module.exports = { FORMS_CABINET };
