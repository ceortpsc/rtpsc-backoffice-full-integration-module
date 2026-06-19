const ESAM_AUTHORIZATIONS = {
    parentEnterpriseIdentity: {
        legalName: "ROSS TAX PRO SOFTWARE CO",
        entityType: "S-Corporation",
        stateOfIncorporation: "Arkansas",
        incorporationDate: "2026-04-06",
        ein: "42-1880710",
        einNameControl: "ROSS",
        businessAddress: "2509 CODY POE RD UNIT B, KILLEEN, TX 76549",
        secretaryOfState: {
            jurisdiction: "Arkansas",
            filingType: "Articles of Incorporation",
            filingDate: "2026-04-06",
            certificateDate: "2026-04-06",
            authorizationCode: "b8dffadea9df9d7a3fbc77a95f5db40"
        },
        sCorporationElection: {
            form: "2553",
            electionEffectiveDate: "2026-04-06",
            taxYear: "Calendar year",
            signerTitle: "DIRECTOR",
            signedDate: "2026-04-22",
            officerOrRepresentative: "ALZOR COMEAUX",
            officerPhone: "254-589-2836"
        },
        federalNotices: [
            {
                notice: "CP575A",
                noticeDate: "2026-04-13",
                assignedEin: "42-1880710",
                firstRequiredReturn: "1120",
                firstRequiredReturnDueDate: "2027-04-15"
            }
        ]
    },
    apiClientApplication: {
        legalName: "ROSS TAX PREP AND BOOKKEEPING",
        dbaName: "ROSS TAX PRO SOFTWARE CO.",
        ein: "33-4891499",
        trackingNumber: "20260213013816217026",
        applicationType: "API Client ID Application",
        applicationStatus: "Completed",
        integrationType: "ISP",
        modules: ["SOR", "TDS", "TINM", "IRIS"],
        callbackUrl: "https://etrac.rosstaxsoftware.com/oauth/callback",
        address: "2509 COY POE RD UNIT B, KILLEEN, TX 76549",
        principal: "Condre D Ross",
        phone: "512-489-6749",
        email: "ceo@rosstaxsoftware.com",
        apiClients: [
            {
                apiLabel: "etrac_realtime_refund_platform",
                clientId: "1280a487-33b6-4959-afb9-f1dd5c70fcc5",
                status: "Active"
            },
            {
                apiLabel: "Ross Tax Pro Software Co | eTRAC Real-Time Refund Intelligence Platform",
                clientId: "04328388-02f2-4ebb-a3f4-1b1b51c9fa1a",
                status: "Active"
            }
        ]
    },
    acaTccApplication: {
        legalName: "ROSS TAX PREP AND BOOKKEEPING",
        dbaName: "254-tax consultants",
        ein: "33-4891499",
        trackingNumber: "20260214062622218643",
        applicationType: "ACA Application for TCC",
        applicationStatus: "Completed",
        businessStructure: "Limited Liability Partnership",
        firmSuitabilityStatus: "Completed",
        phone: "512-489-6748",
        address: "2509 Cody Poe Road unit b Killeen, TX 76549",
        responsibleOfficials: ["ALZOR COMEAUX", "Condre D Ross"],
        authorizedDelegates: ["JULIE LEWIS"],
        tccs: [
            { role: "Issuer", indicator: "P", tcc: "TBRS9", status: "Active" },
            { role: "Transmitter", indicator: "P", tcc: "TBRSB", status: "Active" },
            { role: "Software Developer", indicator: "T", tcc: "TBRS8", status: "Active" }
        ],
        forms: ["1094/1095B", "1094/1095C"],
        transmissionMethods: ["ISS-A2A - System Enroller", "ISS-UI for ACA Internet Transmitter"],
        softwarePackage: {
            taxYear: "2025",
            type: "In-House",
            productName: "ROSS TAX SOFTWARE EDUCATION",
            softwareIds: ["25A0024344", "25A0024345"],
            status: "Test"
        }
    },
    irisTccApplication: {
        legalName: "ROSS TAX PREP AND BOOKKEEPING",
        dbaName: "254-tax consultants",
        ein: "33-4891499",
        trackingNumber: "20260214065015218647",
        applicationType: "IRIS Application for TCC",
        applicationStatus: "Completed",
        businessStructure: "Limited Liability Partnership",
        firmSuitabilityStatus: "Completed",
        combinedFederalStateFilingParticipant: true,
        phone: "512-489-6748",
        address: "2509 Cody Poe Road unit b Killeen, TX 76549",
        responsibleOfficials: ["ALZOR COMEAUX", "Condre D Ross"],
        roles: [
            { role: "Transmitter", status: "Accepted" },
            { role: "Software Developer", status: "Accepted" }
        ],
        tccs: [
            { role: "Transmitter", forms: "1099 Series & 1042-S", method: "A2A", tcc: "DH10B", status: "Active", effectiveDate: "2026-03-03T00:43:00", indicator: "T" },
            { role: "Transmitter", forms: "1099 Series & 1042-S", method: "Portal", tcc: "DH10C", status: "Active", effectiveDate: "2026-03-03T00:43:00", indicator: "P" },
            { role: "Software Developer", forms: "1099 Series & 1042-S", method: "A2A", tcc: "DH10D", status: "Active", effectiveDate: "2026-03-03T00:43:00", indicator: "T" }
        ]
    },
    efileApplication: {
        legalName: "Condre D Ross",
        dbaName: "ROSS TAX PRO SOFTWARE CO",
        maskedSsn: "***-**-6507",
        trackingNumber: "20250422015627906875",
        applicationType: "e-File Application",
        applicationStatus: "Completed",
        businessStructure: "Sole Proprietorship",
        firmSuitabilityStatus: "Completed",
        applicationSuitabilityRequired: true,
        transmissionStatus: "Test",
        address: "2509 CODY POE RD UNIT B, KILLEEN, TX 76549",
        phone: "254-206-1037",
        providerOptions: [
            "Electronic Return Originator",
            "Intermediate Service Provider",
            "Online Provider",
            "Software Developer",
            "Transmitter"
        ],
        efin: { id: "748335", status: "Active", effectiveDate: "2025-05-12T10:14:00" },
        etins: [
            { id: "12181", type: "Production", status: "Active", effectiveDate: "2026-02-11T03:39:00", providerOption: "Online Provider" },
            { id: "95409", type: "Production", status: "Active", effectiveDate: "2025-05-12T10:14:00", providerOption: "Transmitter" },
            { id: "95410", type: "Test", status: "Active", effectiveDate: "2025-05-12T10:14:00", providerOption: "Software Developer" }
        ]
    }
};

module.exports = { ESAM_AUTHORIZATIONS };
