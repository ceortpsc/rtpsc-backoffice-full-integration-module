const { runtimeSummary, actionAbilities, systemHealthAlerts } = require('../lib/next-runtime');

const nav = [
  ['/', 'Command Center'],
  ['/workspace', 'Workspace'],
  ['/system-health', 'System Health'],
  ['/terminal', 'Terminal']
];

export default function Page() {
  return (
    <main className="next-frame">
      <section className="rtpsc-header next-hero">
        <h1>RTPSC Next.js Operations Console</h1>
        <p>Dashboards • Modules • WebSocket manifest • Endpoints • Action abilities • System health alerts</p>
        <nav className="next-nav" aria-label="Next dashboard navigation">
          {nav.map(([href, label]) => <a className="rtpsc-pill" href={href} key={href}>{label}</a>)}
        </nav>
      </section>
      <section className="next-grid">
        <article className="rtpsc-card next-card"><h2>Workspace Interfaces</h2><p>{runtimeSummary.dashboards.join(' • ')}</p></article>
        <article className="rtpsc-card next-card"><h2>Registered Endpoints</h2><p>{runtimeSummary.apiEndpoints.join(' • ')}</p></article>
        <article className="rtpsc-card next-card"><h2>Action Abilities</h2><p>{actionAbilities.map((ability) => ability.code).join(' • ')}</p></article>
        <article className="rtpsc-card next-card"><h2>WebSocket Channels</h2><p>{runtimeSummary.websocketChannels.join(' • ')}</p></article>
        <article className="rtpsc-card next-card"><h2>System Alerts</h2><p>{systemHealthAlerts.map((alert) => alert.status).join(' • ')}</p></article>
        <article className="rtpsc-card next-card"><h2>Guardrail Mode</h2><p>Read-only dashboard by default. External transmissions remain blocked until signed envelope and human review are satisfied.</p></article>
      </section>
    </main>
  );
}
