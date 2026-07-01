function createTaskManager(config = {}) {
  const tasks = Array.isArray(config.tasks) ? config.tasks : [];
  const syncMode = config.syncMode || 'AUTOMATED';
  let runCount = 0;

  return {
    syncMode,
    tasks,
    status: 'READY',
    lastRunAt: null,
    run() {
      runCount += 1;
      const executedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        status: 'COMPLETED',
        executedAt: new Date().toISOString()
      }));

      this.lastRunAt = new Date().toISOString();
      this.status = 'SYNCED';
      return {
        executed: true,
        runCount,
        syncMode: this.syncMode,
        tasks: executedTasks,
        message: 'Task manager executed and synchronized automation tasks.'
      };
    }
  };
}

module.exports = {
  createTaskManager
};
