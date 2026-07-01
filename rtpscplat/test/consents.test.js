const test = require('node:test');
const assert = require('node:assert/strict');
const { buildTaxpayerConsentBundle } = require('../platform/compliance/consents');

test('buildTaxpayerConsentBundle creates consent, acknowledgment, and agreement content', () => {
  const bundle = buildTaxpayerConsentBundle({ taxpayerName: 'Jane Doe', taxpayerId: 'TP-100', email: 'jane@example.com', serviceType: 'Return Preparation' });

  assert.match(bundle.html, /Taxpayer Consent and Acknowledgment Packet/);
  assert.match(bundle.text, /Consent:/);
  assert.match(bundle.text, /Acknowledgment:/);
  assert.match(bundle.text, /Agreement:/);
  assert.match(bundle.filename, /consent-/);
});
