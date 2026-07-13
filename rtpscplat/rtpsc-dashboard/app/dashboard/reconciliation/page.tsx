import { reconciliation } from '@/lib/data';

export default function ReconciliationPage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">CUSTODIAL LEDGER</p>
                <h1>Reconciliation Control</h1>
                <p>Balanced-versus-variance ledger posture with settlement evidence visibility.</p>
            </header>
            <div className="table-shell">
                <table>
                    <thead>
                        <tr>
                            <th>Record</th>
                            <th>Case</th>
                            <th>State</th>
                            <th>Expected</th>
                            <th>Settled</th>
                            <th>Variance</th>
                            <th>Settlement Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reconciliation.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.caseId}</td>
                                <td>{item.ledgerState}</td>
                                <td>${item.expectedAmount.toLocaleString()}</td>
                                <td>${item.settledAmount.toLocaleString()}</td>
                                <td>${item.varianceAmount.toLocaleString()}</td>
                                <td>{item.settlementDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
