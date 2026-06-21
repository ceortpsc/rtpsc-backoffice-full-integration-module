const { actionAbilities } = require('../../lib/next-runtime');

export default function WorkspacePage() {
  return (
    <main className="next-frame">
      <section className="rtpsc-header next-hero"><h1>ERO Workspace Interfaces</h1><p>Operator tools, action abilities, modules, and review-gated work queues.</p></section>
      <section className="next-grid">
        {actionAbilities.map((ability) => (
          <article className="rtpsc-card next-card" key={ability.code}>
            <h2>{ability.code}</h2>
            <p>{ability.label}</p>
            <span className="rtpsc-badge">{ability.requiresReview ? 'Review Required' : 'Ready'}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
