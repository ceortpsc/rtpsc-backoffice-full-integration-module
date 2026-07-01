const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildExportPackage,
  buildWhiteLabelPreset,
  buildPrintSettings,
  buildEroBrandingProfile,
  buildLetterhead,
  buildFooter,
  buildDigitalOwnerSignatureBlock
} = require('../platform/export/engine');

test('buildExportPackage renders HTML with white-label branding', () => {
  const result = buildExportPackage(
    { title: 'Return Summary', body: 'Client return ready for filing' },
    {
      format: 'html',
      preset: 'ero-portal',
      whiteLabel: { companyName: 'ROSS TAX PRO', primaryColor: '#0f4c81' }
    }
  );

  assert.equal(result.format, 'html');
  assert.match(result.content, /ROSS TAX PRO/);
  assert.match(result.content, /#0f4c81/);
  assert.match(result.content, /Authorized Digital ERO Signature/);
  assert.match(result.content, /Copyright 2026 ROSS TAX PRO SOFTWARE CO/);
  assert.equal(result.printSettings.paperSize, 'Letter');
});

test('buildWhiteLabelPreset returns a preset by name', () => {
  const preset = buildWhiteLabelPreset('client-portal');
  assert.equal(preset.companyName, 'ROSS TAX PRO');
  assert.equal(preset.primaryColor, '#0f766e');
});

test('buildPrintSettings merges defaults with overrides', () => {
  const settings = buildPrintSettings({ paperSize: 'A4' });
  assert.equal(settings.paperSize, 'A4');
  assert.equal(settings.orientation, 'Portrait');
  assert.equal(settings.includeLogo, true);
});

test('branding engine builds letterhead, footer, and digital owner signature block', () => {
  const profile = buildEroBrandingProfile({ ownerName: 'Condre Dvon Ross' });
  const letterhead = buildLetterhead(profile);
  const footer = buildFooter(profile);
  const signature = buildDigitalOwnerSignatureBlock(profile, { signatureToken: 'ERO-SIG-TEST-001' });

  assert.match(letterhead.companyLine, /ROSS TAX PRO SOFTWARE CO/);
  assert.match(footer.copyrightLine, /Copyright 2026/);
  assert.equal(signature.signatureToken, 'ERO-SIG-TEST-001');
  assert.match(signature.signatureText, /Digitally Signed/);
});
