import Link from 'next/link';
import { getSummary } from '@/lib/data';

const summary = getSummary();

const cards = [
    { label: 'Open Cases', value: summary.openCases, route: '/dashboard/cases' },
    { label: 'Critical Cases', value: summary.criticalCases, route: '/dashboard/cases' },
    { label: 'Accepted Transmissions', value: summary.acceptedTransmissions, route: '/dashboard/transmissions' },
    { label: 'Rejected Transmissions', value: summary.rejectedTransmissions, route: '/dashboard/transmissions' },
    { label: 'Ledger Variances', value: summary.unresolvedLedgerVariances, route: '/dashboard/reconciliation' },
    { label: 'Active Compliance Alerts', value: summary.activeComplianceAlerts, route: '/dashboard/compliance' },
    { label: 'Managed Clients', value: summary.managedClients, route: '/dashboard/clients' }
];

export default function DashboardPage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">RTP CONTROL TOWER</p>
                <h1>Operations Dashboard</h1>
                <p>
                    Unified case control, transmission telemetry, compliance evidence, and custodial reconciliation.
                </p>
            </header>

            <div className="metric-grid">
                {cards.map((card) => (
                    <article key={card.label} className="metric-card">
                        <p>{card.label}</p>
                        <strong>{card.value}</strong>
                        <Link href={card.route}>Open {card.label}</Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
