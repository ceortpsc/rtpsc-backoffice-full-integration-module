const test = require('node:test');
const assert = require('node:assert/strict');
const { createTaskManager } = require('../platform/automation/task-manager');

test('createTaskManager executes and syncs queued tasks', () => {
  const manager = createTaskManager({ tasks: [{ id: 'sync', name: 'Sync' }], syncMode: 'AUTOMATED' });
  const result = manager.run();
  assert.equal(result.executed, true);
  assert.equal(result.tasks[0].status, 'COMPLETED');
  assert.equal(manager.status, 'SYNCED');
});
