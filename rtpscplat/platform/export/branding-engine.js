function buildEroBrandingProfile(overrides = {}) {
    return {
        companyName: 'ROSS TAX PRO SOFTWARE CO',
        dbaName: 'ROSS TAX PRO',
        officeAddress: '2509 CODY POE RD UNIT B, KILLEEN, TX 76549',
        supportEmail: 'ceo@rosstaxsoftware.com',
        supportPhone: '(512) 489-6748',
        website: 'https://etrac.rosstaxsoftware.com',
        ownerName: 'Condre Dvon Ross',
        ownerTitle: 'CEO / ERO Owner',
        copyrightLine: 'Copyright 2026 ROSS TAX PRO SOFTWARE CO. All rights reserved.',
        ...overrides
    };
}

function buildLetterhead(profile = {}) {
    const brand = buildEroBrandingProfile(profile);
    return {
        companyLine: `${brand.companyName} (${brand.dbaName})`,
        addressLine: brand.officeAddress,
        contactLine: `${brand.supportPhone} | ${brand.supportEmail}`,
        websiteLine: brand.website
    };
}

function buildFooter(profile = {}) {
    const brand = buildEroBrandingProfile(profile);
    return {
        copyrightLine: brand.copyrightLine,
        legalLine: 'Prepared for authorized tax operations and subject to compliance controls.',
        retentionLine: 'Document retention and audit trail logging enabled.'
    };
}

function buildDigitalOwnerSignatureBlock(profile = {}, options = {}) {
    const brand = buildEroBrandingProfile(profile);
    const signedAt = options.signedAt || new Date().toISOString();
    const signatureToken = options.signatureToken || `ERO-SIG-${Date.now()}`;

    return {
        ownerName: brand.ownerName,
        ownerTitle: brand.ownerTitle,
        signatureText: `${brand.ownerName} (Digitally Signed)`,
        signatureToken,
        signedAt,
        attestation: 'I certify this document is authorized by the ERO owner and issued under enterprise controls.'
    };
}

module.exports = {
    buildEroBrandingProfile,
    buildLetterhead,
    buildFooter,
    buildDigitalOwnerSignatureBlock
};
