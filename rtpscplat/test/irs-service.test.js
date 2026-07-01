const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildIrsTaxProIntegration,
  buildIrsApiPayload,
  buildIrsFormPacket,
  buildTransmissionValidationBundle
} = require('../platform/irs/service');

test('buildIrsTaxProIntegration exposes the configured IRS integration', () => {
  const integration = buildIrsTaxProIntegration();
  assert.equal(integration.provider, 'IRS TaxPro');
  assert.ok(integration.capabilities.includes('Submission Routing'));
});

test('buildIrsTaxProIntegration returns workflow and CAF submission state', () => {
  const integration = buildIrsTaxProIntegration({ taxpayerName: 'Jane Doe', taxpayerId: 'TP-200', forms: ['Form 8821', 'Form 2848'], cafSubmitted: true });
  assert.equal(integration.status, 'CAF SUBMITTED');
  assert.ok(integration.workflow.includes('Queue IRS CAF transmission'));
});

test('buildIrsApiPayload returns a normalized IRS payload', () => {
  const payload = buildIrsApiPayload({ taxpayerId: 'TP-200', serviceType: 'E-File', amount: 500 });
  assert.equal(payload.taxpayerId, 'TP-200');
  assert.equal(payload.status, 'READY');
});

test('buildIrsFormPacket returns fax-ready forms and instructions', () => {
  const packet = buildIrsFormPacket({ forms: ['Form 8821', 'Form 2848'] });
  assert.equal(packet.readyForFax, true);
  assert.equal(packet.signatureMode, 'Wet Signature');
  assert.match(packet.instructions, /CAF unit/);
});

test('buildTransmissionValidationBundle blocks invalid transmission and returns prevention steps', () => {
  const result = buildTransmissionValidationBundle({
    taxpayerName: 'John Taxpayer',
    taxpayerId: 'TP-900',
    taxYear: 2025,
    attachments: ['signed-8879']
  });

  assert.equal(result.transmissionStatus, 'BLOCKED');
  assert.equal(result.efileReady, false);
  assert.ok(result.blockers.length > 0);
  assert.equal(result.retentionCertification.compliant, false);
  assert.match(result.conversion.xml, /IdentityVerification4883C/);
});

test('buildTransmissionValidationBundle validates compliant return package and ledger certification', () => {
  const result = buildTransmissionValidationBundle({
    taxpayerName: 'Jane Client',
    taxpayerId: 'TP-901',
    taxYear: 2025,
    ssnLast4: '1234',
    sscPresent: true,
    identityVerified: true,
    eroName: 'Ross Tax ERO',
    eroEfin: '123456',
    practitionerPin: '12345',
    practitionerPtin: 'P12345678',
    consentSigned: true,
    attachments: ['signed-8879', 'government-id', 'consent-form', 'retention-certification'],
    debitTotal: 1500,
    creditTotal: 1500
  });

  assert.equal(result.transmissionStatus, 'VALIDATED');
  assert.equal(result.returnValidation, 'PASSED');
  assert.equal(result.complianceLedger.balanceCertification.status, 'CERTIFIED');
  assert.equal(result.blockers.length, 0);
  assert.match(result.conversion.fileName, /4883c-TP-901\.xml/);
});
