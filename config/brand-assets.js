const BRAND_ASSETS = {
    version: "1.0",
    brandName: "ROSS TAX PRO SOFTWARE CO",
    palette: {
        navyBlue: "#0F2C59",
        shinyGold: "#D4AF37",
        goldAccent: "#DAC0A3",
        blackTrim: "#111827",
        eggshell: "#F8F4EC",
        slate: "#1F2937"
    },
    assets: {
        logo: "assets/rtpsc-logo.svg",
        themeCss: "assets/rtpsc-theme.css",
        letterhead: "letterhead.html",
        systemHealthReport: "system-health-report.html"
    },
    documentSurfaces: ["official-office-forms", "client-documents", "reports", "system-health-reports", "interface-output-panel"],
    productionTheme: {
        stylesheet: "assets/rtpsc-theme.css",
        primaryBackground: "eggshell",
        headerTreatment: "navy-gradient-with-gold-border",
        surfaceTreatment: "eggshell-soft-panels",
        responsiveClass: "rtpsc-responsive-grid"
    },
    footer: {
        copyright: "Copyright (c) 2026 ROSS TAX PRO SOFTWARE CO. All rights reserved.",
        privacy: "Privacy and security controls enforced by RTPSC runtime guardrails.",
        terms: "Use is restricted to authorized operators and review-gated workflows."
    }
};

module.exports = { BRAND_ASSETS };
