import { cases } from '@/lib/data';

export default function CasesPage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">CASE ORCHESTRATION</p>
                <h1>Case Queue</h1>
                <p>Live queue for notice handling, filing readiness, and follow-up resolution.</p>
            </header>
            <div className="table-shell">
                <table>
                    <thead>
                        <tr>
                            <th>Case</th>
                            <th>Taxpayer</th>
                            <th>Notice</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Due Date</th>
                            <th>Risk</th>
                            <th>Balance at Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.taxpayerName}</td>
                                <td>{item.noticeCode}</td>
                                <td>{item.status}</td>
                                <td>{item.owner}</td>
                                <td>{item.dueDate}</td>
                                <td>{item.risk}</td>
                                <td>${item.balanceAtRisk.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
