import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
    title: 'Vantage Avalon eFile Transmission Platform',
    description: 'MEF transmission, refund intelligence, variance reconciliation, IRM notice response, and compliance operations control platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="site-shell">
                    <header className="site-header">
                        <div>
                            <p className="brand-mark">VANTAGE AVALON EFILE PLATFORM</p>
                            <h1>eFile Transmission and Compliance Operations</h1>
                        </div>
                        <nav className="site-nav" aria-label="Primary">
                            <Link href="/">Home</Link>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/dashboard/ai-console">AI Console</Link>
                            <Link href="/dashboard/cases">Cases</Link>
                            <Link href="/dashboard/transmissions">Transmissions</Link>
                            <Link href="/dashboard/reconciliation">Reconciliation</Link>
                            <Link href="/dashboard/compliance">Compliance</Link>
                            <Link href="/dashboard/clients">Clients</Link>
                        </nav>
                    </header>
                    <main className="site-main">{children}</main>
                </div>
            </body>
        </html>
    );
}
