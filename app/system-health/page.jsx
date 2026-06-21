const { systemHealthAlerts } = require('../../lib/next-runtime');

export default function SystemHealthPage() {
  return (
    <main className="next-frame">
      <section className="rtpsc-header next-hero"><h1>System Health Alerts</h1><p>Live alert output panels for health, worker, queue, and compliance channels.</p></section>
      <section>
        {systemHealthAlerts.map((alert) => (
          <article className="rtpsc-panel next-alert" key={`${alert.channel}-${alert.message}`}>
            <strong>{alert.severity.toUpperCase()} • {alert.channel}</strong>
            <p>{alert.message}</p>
            <span className="rtpsc-badge">{alert.status}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
