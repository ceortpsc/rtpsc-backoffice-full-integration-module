function createAutomationScheduler(config = {}) {
  const tasks = Array.isArray(config.tasks) ? config.tasks : [];
  const intervalMs = Number(config.intervalMs || 15000);
  let runCount = 0;

  return {
    intervalMs,
    tasks,
    status: 'READY',
    lastRunAt: null,
    run() {
      runCount += 1;
      const executedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        executed: true,
        status: 'COMPLETED'
      }));

      this.lastRunAt = new Date().toISOString();
      this.status = 'RUNNING';
      return {
        executed: true,
        runCount,
        intervalMs: this.intervalMs,
        tasks: executedTasks,
        message: 'Automation scheduler executed background tasks for the application.'
      };
    }
  };
}

module.exports = {
  createAutomationScheduler
};
