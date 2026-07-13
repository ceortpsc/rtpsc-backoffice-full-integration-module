import { transmissions } from '@/lib/data';

export default function TransmissionsPage() {
    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">MEF + A2A PIPELINE</p>
                <h1>Transmission Telemetry</h1>
                <p>Submission and ACK lifecycle monitoring for all filing channels.</p>
            </header>
            <div className="table-shell">
                <table>
                    <thead>
                        <tr>
                            <th>Transmission</th>
                            <th>Case</th>
                            <th>Channel</th>
                            <th>Submitted At</th>
                            <th>ACK Status</th>
                            <th>ACK Code</th>
                            <th>Retries</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transmissions.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.caseId}</td>
                                <td>{item.channel}</td>
                                <td>{new Date(item.submittedAt).toLocaleString()}</td>
                                <td>{item.ackStatus}</td>
                                <td>{item.ackCode}</td>
                                <td>{item.retries}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
