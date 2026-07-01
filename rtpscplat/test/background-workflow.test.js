const test = require('node:test');
const assert = require('node:assert/strict');
const { createBackgroundWorkflow } = require('../platform/compliance/background-workflow');

test('createBackgroundWorkflow creates an automated execution workflow', () => {
  const workflow = createBackgroundWorkflow({ queue: [{ id: 1 }], intervalMs: 1000 });
  const result = workflow.run();
  assert.equal(workflow.status, 'ACTIVE');
  assert.equal(result.executed, true);
  assert.equal(result.queueLength, 1);
});
