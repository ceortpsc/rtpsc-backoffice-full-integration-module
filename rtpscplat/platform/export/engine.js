const {
  buildEroBrandingProfile,
  buildLetterhead,
  buildFooter,
  buildDigitalOwnerSignatureBlock
} = require('./branding-engine');

function buildWhiteLabelPreset(name) {
  const presets = {
    'ero-portal': {
      companyName: 'ROSS TAX PRO',
      primaryColor: '#0f4c81',
      secondaryColor: '#f5f7fb',
      logoUrl: '/assets/logo.svg'
    },
    'client-portal': {
      companyName: 'ROSS TAX PRO',
      primaryColor: '#0f766e',
      secondaryColor: '#ecfeff',
      logoUrl: '/assets/logo.svg'
    }
  };

  return presets[name] || presets['ero-portal'];
}

function buildPrintSettings(overrides = {}) {
  return {
    paperSize: 'Letter',
    orientation: 'Portrait',
    includeLogo: true,
    includeFooter: true,
    margins: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
    ...overrides
  };
}

function buildExportPackage(payload, options = {}) {
  const preset = buildWhiteLabelPreset(options.preset || 'ero-portal');
  const printSettings = buildPrintSettings(options.printSettings || {});
  const whiteLabel = {
    ...preset,
    ...(options.whiteLabel || {})
  };
  const brandingProfile = buildEroBrandingProfile(options.brandingProfile || {});
  const letterhead = buildLetterhead(brandingProfile);
  const footer = buildFooter(brandingProfile);
  const signatureBlock = buildDigitalOwnerSignatureBlock(brandingProfile, options.signatureBlock || {});

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${payload.title}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #222; }
      .brand { background: ${whiteLabel.primaryColor}; color: white; padding: 12px 16px; }
      .letterhead { border-bottom: 2px solid ${whiteLabel.primaryColor}; padding: 12px 16px; }
      .letterhead p { margin: 4px 0; font-size: 0.9rem; }
      .content { padding: 16px; }
      .signature-block { border-top: 1px solid #d1d5db; margin-top: 24px; padding-top: 16px; }
      .footer { border-top: 1px solid #e5e7eb; margin-top: 24px; padding: 12px 16px; color: #4b5563; font-size: 0.85rem; }
    </style>
  </head>
  <body>
    <div class="letterhead">
      <p><strong>${letterhead.companyLine}</strong></p>
      <p>${letterhead.addressLine}</p>
      <p>${letterhead.contactLine}</p>
      <p>${letterhead.websiteLine}</p>
    </div>
    <div class="brand">${whiteLabel.companyName}</div>
    <div class="content">
      <h1>${payload.title}</h1>
      <p>${payload.body}</p>
      <div class="signature-block">
        <p><strong>Authorized Digital ERO Signature</strong></p>
        <p>${signatureBlock.signatureText}</p>
        <p>Title: ${signatureBlock.ownerTitle}</p>
        <p>Signature Token: ${signatureBlock.signatureToken}</p>
        <p>Signed At: ${signatureBlock.signedAt}</p>
        <p>${signatureBlock.attestation}</p>
      </div>
    </div>
    <div class="footer">
      <p>${footer.copyrightLine}</p>
      <p>${footer.legalLine}</p>
      <p>${footer.retentionLine}</p>
    </div>
  </body>
</html>`;

  return {
    format: options.format || 'html',
    content: html,
    printSettings,
    whiteLabel,
    brandingProfile,
    letterhead,
    footer,
    signatureBlock
  };
}

module.exports = {
  buildExportPackage,
  buildWhiteLabelPreset,
  buildPrintSettings,
  buildEroBrandingProfile,
  buildLetterhead,
  buildFooter,
  buildDigitalOwnerSignatureBlock
};
