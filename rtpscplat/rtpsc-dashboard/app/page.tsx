const widgets = [
    { label: 'Automation', value: 'Enabled', note: 'Scheduler and task manager synchronized' },
    { label: 'Cloudflare Pages', value: 'Ready', note: 'Static export wired for deployment' },
    { label: 'Cloudflare Worker', value: 'Ready', note: 'Sync API endpoint enabled' },
    { label: 'Release Mode', value: 'Automated', note: 'Single command deploy pipeline' }
];

export default function HomePage() {
    return (
        <main className="dashboard-shell">
            <section className="hero">
                <p className="kicker">ROSS TAX PRO PLATFORM</p>
                <h1>Operations Dashboard</h1>
                <p>
                    Next.js dashboard with Cloudflare Pages and Workers fully automated, synchronized, and deploy-ready.
                </p>
            </section>
            <section className="grid">
                {widgets.map((widget) => (
                    <article key={widget.label} className="card">
                        <h2>{widget.label}</h2>
                        <strong>{widget.value}</strong>
                        <p>{widget.note}</p>
                    </article>
                ))}
            </section>
        </main>
    );
}
