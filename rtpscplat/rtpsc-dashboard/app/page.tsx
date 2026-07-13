import Link from 'next/link';

const actions = [
    {
        title: 'Open Operations Dashboard',
        note: 'Live case, transmission, and compliance telemetry.',
        href: '/dashboard'
    },
    {
        title: 'Review Filing Case Queue',
        note: 'Prioritize by due date, risk, and workflow stage.',
        href: '/dashboard/cases'
    },
    {
        title: 'Inspect MeF and A2A ACK Status',
        note: 'Track accepted, pending, and rejected transmission events.',
        href: '/dashboard/transmissions'
    },
    {
        title: 'Run Reconciliation Oversight',
        note: 'Monitor variance and settlement integrity in custodial ledgers.',
        href: '/dashboard/reconciliation'
    },
    {
        title: 'Open Compliance Control Desk',
        note: 'Review active control alerts, owners, and statuses.',
        href: '/dashboard/compliance'
    },
    {
        title: 'Manage Client Portfolio',
        note: 'Track authority posture and active filing load by client.',
        href: '/dashboard/clients'
    }
];

export default function HomePage() {
    return (
        <section className="page-shell">
            <header className="page-header home-header">
                <p className="eyebrow">RTP ENTERPRISE COMMAND SURFACE</p>
                <h1>Production Filing and Clearing Operations</h1>
                <p>
                    Unified Next.js operations front end with seeded production-grade backend telemetry routes for ERO case
                    management, transmission control, and custodial reconciliation.
                </p>
            </header>

            <div className="metric-strip">
                <article>
                    <span>Registry Node</span>
                    <strong>EFIN 748335</strong>
                </article>
                <article>
                    <span>Authority Control</span>
                    <strong>CAF 0316-76228R</strong>
                </article>
                <article>
                    <span>Platform State</span>
                    <strong>Production Ready</strong>
                </article>
            </div>

            <section className="action-grid">
                {actions.map((action) => (
                    <article key={action.title} className="action-card">
                        <h2>{action.title}</h2>
                        <p>{action.note}</p>
                        <Link href={action.href}>Launch</Link>
                    </article>
                ))}
            </section>
        </section>
    );
}
