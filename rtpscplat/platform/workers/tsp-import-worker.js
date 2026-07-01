const { buildIrsTaxProIntegration } = require('../irs/service');

function normalizeTspClientStatus(payload = {}) {
  return {
    source: 'TSP',
    clientId: payload.clientId || '',
    clientName: payload.clientName || '',
    status: payload.status || 'PENDING',
    taxYear: payload.taxYear || new Date().getFullYear(),
    serviceType: payload.serviceType || 'Return Preparation',
    importedAt: new Date().toISOString(),
    syncStatus: 'IMPORTED'
  };
}

function buildTspExportBundle(records = []) {
  const normalized = records.map(normalizeTspClientStatus);
  return {
    source: 'TSP',
    count: normalized.length,
    records: normalized,
    exportReady: true,
    summary: {
      pending: normalized.filter((item) => item.status === 'PENDING').length,
      complete: normalized.filter((item) => item.status === 'COMPLETE').length
    }
  };
}

function runTspImportWorker(input = {}) {
  const records = Array.isArray(input.records) ? input.records : [];
  const bundle = buildTspExportBundle(records);
  const integration = buildIrsTaxProIntegration({
    taxpayerName: input.clientName || '',
    taxpayerId: input.clientId || '',
    serviceType: 'TSP Status Import',
    forms: ['Form 8821', 'Form 2848'],
    cafSubmitted: false
  });

  return {
    worker: 'TSP Import Worker',
    bundle,
    integration,
    message: 'Client statuses converted and exported for local import.'
  };
}

module.exports = {
  normalizeTspClientStatus,
  buildTspExportBundle,
  runTspImportWorker
};
