import '../assets/rtpsc-theme.css';
import './next-dashboard.css';

export const metadata = {
  title: 'RTPSC Operations Console',
  description: 'Review-gated RTPSC Next.js dashboards, endpoints, actions, and system health alerts.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="rtpsc-shell next-shell">{children}</body>
    </html>
  );
}
