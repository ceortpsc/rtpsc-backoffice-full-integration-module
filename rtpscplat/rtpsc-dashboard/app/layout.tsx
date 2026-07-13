import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
    title: 'Ross Tax Pro Control Platform',
    description: 'Production operations and compliance dashboard for RTP filing and clearing'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="site-shell">
                    <header className="site-header">
                        <div>
                            <p className="brand-mark">VANTAGE AVALON DBMS</p>
                            <h1>Ross Tax Pro Control Platform</h1>
                        </div>
                        <nav className="site-nav" aria-label="Primary">
                            <Link href="/">Home</Link>
                            <Link href="/dashboard">Dashboard</Link>
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
