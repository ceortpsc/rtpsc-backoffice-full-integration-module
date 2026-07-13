import { clients } from '@/lib/data';

export default function ClientsPage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">CLIENT OPERATIONS</p>
                <h1>Managed Accounts</h1>
                <p>Active client portfolio with authority status and filing profile readiness.</p>
            </header>
            <div className="table-shell">
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Filing Type</th>
                            <th>Authority</th>
                            <th>Active Cases</th>
                            <th>Last Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((item) => (
                            <tr key={item.id}>
                                <td>{item.legalName}</td>
                                <td>{item.filingType}</td>
                                <td>{item.authorityStatus}</td>
                                <td>{item.activeCases}</td>
                                <td>{new Date(item.lastContactAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
