const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildLedgerEntry,
  buildReconciliationSummary,
  buildWorkpaperBundle,
  buildRegistryEntry,
  buildWhiteLabelFinanceOverview
} = require('../platform/finance/engine');

test('buildLedgerEntry creates a balanced ledger posting object', () => {
  const entry = buildLedgerEntry({ account: 'Retainage', debit: 2500, credit: 0 });
  assert.equal(entry.account, 'Retainage');
  assert.equal(entry.debit, 2500);
});

test('buildReconciliationSummary returns reconciled status and variance', () => {
  const summary = buildReconciliationSummary([
    { debit: 1000, credit: 0 },
    { debit: 0, credit: 1000 }
  ]);
  assert.equal(summary.status, 'RECONCILED');
  assert.equal(summary.balance, 0);
});

test('buildWorkpaperBundle and registry entries support automation output', () => {
  const workpaper = buildWorkpaperBundle({ title: 'IRS Workpaper', withholdings: 2000 });
  const registry = buildRegistryEntry({ label: 'Federal Withholding', amount: 2000 });
  assert.equal(workpaper.withholdings, 2000);
  assert.equal(registry.complianceTag, 'IRS-READY');
});

test('buildWhiteLabelFinanceOverview exposes branded finance controls', () => {
  const overview = buildWhiteLabelFinanceOverview();
  assert.equal(overview.branding.companyName, 'ROSS TAX PRO');
  assert.ok(overview.controls.some((control) => control.id === 'reconciliation'));
  assert.equal(overview.compliance.enforcement, 'HEAVILY ENFORCED');
});
