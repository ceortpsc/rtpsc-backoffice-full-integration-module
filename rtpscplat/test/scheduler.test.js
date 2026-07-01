const test = require('node:test');
const assert = require('node:assert/strict');
const { createAutomationScheduler } = require('../platform/automation/scheduler');

test('createAutomationScheduler executes queued background tasks', () => {
  const scheduler = createAutomationScheduler({ tasks: [{ id: 'redaction', name: 'Redaction' }], intervalMs: 1000 });
  const result = scheduler.run();
  assert.equal(result.executed, true);
  assert.equal(result.tasks[0].executed, true);
  assert.equal(scheduler.status, 'RUNNING');
});
