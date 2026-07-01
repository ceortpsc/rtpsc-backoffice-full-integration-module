const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRedactionWorkflow, buildPublicationComplianceBundle } = require('../platform/compliance/redaction');

test('buildRedactionWorkflow redacts and encrypts document bundles', () => {
  const result = buildRedactionWorkflow({ documents: [{ name: '1040' }], encrypt: true });
  assert.equal(result.status, 'EXECUTED');
  assert.equal(result.documents[0].status, 'REDACTED');
  assert.equal(result.encryptionMode, 'AES-256');
});

test('buildPublicationComplianceBundle returns publication requirements', () => {
  const bundle = buildPublicationComplianceBundle({ title: 'IRS Publication Bundle' });
  assert.equal(bundle.enforcement, 'HEAVILY ENFORCED');
  assert.ok(bundle.requirements.includes('Encryption before storage or transmission'));
});
