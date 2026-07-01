const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeTspClientStatus, buildTspExportBundle, runTspImportWorker } = require('../platform/workers/tsp-import-worker');

test('normalizeTspClientStatus maps TSP status records into local shape', () => {
  const normalized = normalizeTspClientStatus({ clientId: 'C-1', clientName: 'Ada', status: 'COMPLETE' });
  assert.equal(normalized.source, 'TSP');
  assert.equal(normalized.status, 'COMPLETE');
});

test('buildTspExportBundle returns export-ready bundle summary', () => {
  const bundle = buildTspExportBundle([{ clientId: 'C-1', clientName: 'Ada', status: 'COMPLETE' }]);
  assert.equal(bundle.count, 1);
  assert.equal(bundle.summary.complete, 1);
});

test('runTspImportWorker produces import and integration output', () => {
  const result = runTspImportWorker({ records: [{ clientId: 'C-1', clientName: 'Ada', status: 'PENDING' }], clientName: 'Ada', clientId: 'C-1' });
  assert.equal(result.worker, 'TSP Import Worker');
  assert.equal(result.bundle.count, 1);
});
