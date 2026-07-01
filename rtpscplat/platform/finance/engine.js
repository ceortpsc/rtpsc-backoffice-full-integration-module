function buildLedgerEntry(entry = {}) {
  return {
    id: entry.id || `ledger-${Date.now()}`,
    account: entry.account || '',
    description: entry.description || '',
    debit: Number(entry.debit || 0),
    credit: Number(entry.credit || 0),
    currency: entry.currency || 'USD',
    postedAt: entry.postedAt || new Date().toISOString()
  };
}

function buildReconciliationSummary(transactions = []) {
  const totalDebits = transactions.reduce((sum, item) => sum + Number(item.debit || 0), 0);
  const totalCredits = transactions.reduce((sum, item) => sum + Number(item.credit || 0), 0);
  const balance = totalDebits - totalCredits;

  return {
    totalDebits,
    totalCredits,
    balance,
    status: balance === 0 ? 'RECONCILED' : 'PENDING REVIEW',
    variance: Math.abs(balance)
  };
}

function buildWorkpaperBundle(payload = {}) {
  return {
    title: payload.title || 'Workpaper Bundle',
    client: payload.client || '',
    period: payload.period || '',
    withholdings: Number(payload.withholdings || 0),
    balances: payload.balances || [],
    notes: payload.notes || ['IRS-compliant registry preparation', 'Retention and audit logging enabled']
  };
}

function buildRegistryEntry(payload = {}) {
  return {
    id: payload.id || `registry-${Date.now()}`,
    category: payload.category || 'General',
    label: payload.label || 'Registry Entry',
    amount: Number(payload.amount || 0),
    status: payload.status || 'READY',
    complianceTag: payload.complianceTag || 'IRS-READY'
  };
}

function buildWhiteLabelFinanceOverview() {
  return {
    branding: {
      companyName: 'ROSS TAX PRO',
      moduleName: 'White-Label Finance Hub',
      theme: 'enterprise'
    },
    controls: [
      { id: 'ledger-posting', label: 'Automated Ledger Posting', enabled: true },
      { id: 'reconciliation', label: 'Variance Reconciliation', enabled: true },
      { id: 'workpapers', label: 'Workpaper Generation', enabled: true },
      { id: 'registry', label: 'Registry Automation', enabled: true }
    ],
    compliance: {
      irsRequirements: ['Withholding tracking', 'Workpaper retention', 'Audit trail preservation'],
      enforcement: 'HEAVILY ENFORCED',
      retention: 'AUTOMATED'
    }
  };
}

module.exports = {
  buildLedgerEntry,
  buildReconciliationSummary,
  buildWorkpaperBundle,
  buildRegistryEntry,
  buildWhiteLabelFinanceOverview
};
