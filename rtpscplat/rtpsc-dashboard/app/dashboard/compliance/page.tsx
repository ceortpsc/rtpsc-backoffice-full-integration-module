import { complianceAlerts } from '@/lib/data';

export default function CompliancePage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">CONTROL GOVERNANCE</p>
                <h1>Compliance Alerts</h1>
                <p>Active controls, risk severity, and owner accountability for policy exceptions.</p>
            </header>
            <div className="table-shell">
                <table>
                    <thead>
                        <tr>
                            <th>Alert</th>
                            <th>Control</th>
                            <th>Severity</th>
                            <th>Owner</th>
                            <th>Opened At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complianceAlerts.map((item) => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.control}</td>
                                <td>{item.severity}</td>
                                <td>{item.owner}</td>
                                <td>{new Date(item.openedAt).toLocaleString()}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
