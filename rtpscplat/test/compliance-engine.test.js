const test = require('node:test');
const assert = require('node:assert/strict');
const { buildComplianceOverview, buildComplianceExportBundle } = require('../platform/compliance/engine');
const { buildPublicationChangeCenter, buildPublicationChangeExport } = require('../platform/compliance/publications');

test('buildComplianceOverview returns policy, monitoring, and control data', () => {
  const overview = buildComplianceOverview();

  assert.equal(overview.monitoring.status, 'AUTOMATED');
  assert.equal(overview.killSwitches.length, 3);
  assert.ok(overview.policyBundle.some((policy) => policy.id === 'privacy-policy'));
  assert.ok(overview.controls.some((control) => control.id === 'rbac-enforcement'));
});

test('buildComplianceExportBundle produces print-ready PDF and text content', () => {
  const bundle = buildComplianceExportBundle({ title: 'Compliance Bundle' });

  assert.match(bundle.html, /ROSS TAX PRO/);
  assert.match(bundle.text, /Privacy Policy/);
  assert.match(bundle.text, /Terms of Service/);
  assert.match(bundle.pdf, /^%PDF/);
  assert.equal(bundle.filename, 'ross-tax-pro-compliance-packet.pdf');
  assert.match(bundle.pdfBase64, /[A-Za-z0-9+/=]+/);
});

test('buildPublicationChangeCenter returns policy updates, mandates, and role-facing communications', () => {
  const packet = buildPublicationChangeCenter({
    policyVersion: '2026.07.01',
    tosVersion: '2026.07.01',
    irsPublicationRef: 'IRS Publication 17 Update'
  });

  assert.equal(packet.metadata.policyVersion, '2026.07.01');
  assert.ok(packet.policyStatements.length >= 3);
  assert.ok(packet.irsPublicationUpdates.some((item) => /IRS Publication/.test(item.title)));
  assert.match(packet.clientFacing.welcomeLetter, /Welcome to ROSS TAX PRO/);
  assert.match(packet.employeeFacing.operationalMemo, /Employee Operations Bulletin/);
  assert.match(packet.eroFacing.serviceBureauDirective, /ERO Service Bureau Directive/);
});

test('buildPublicationChangeExport returns exportable packet text', () => {
  const exportPacket = buildPublicationChangeExport();

  assert.equal(exportPacket.filename, 'publication-policy-updates.txt');
  assert.match(exportPacket.text, /Policy Statements and Mandates/);
  assert.match(exportPacket.text, /Client Welcome Letter/);
  assert.match(exportPacket.text, /ERO Service Bureau Directive/);
});
