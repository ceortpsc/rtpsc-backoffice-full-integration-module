import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dashboardPkgPath = path.join(root, 'rtpsc-dashboard', 'package.json');
const outputDir = path.join(root, 'rtpsc-dashboard', 'out');
const manifestPath = path.join(root, 'workers', 'dashboard-sync', 'src', 'generated', 'dashboard-manifest.json');

async function runSync() {
    const pkgRaw = await fs.readFile(dashboardPkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);

    await fs.access(outputDir);

    const manifest = {
        name: 'ROSS TAX PRO Dashboard',
        buildTime: new Date().toISOString(),
        version: pkg.version,
        status: 'synced'
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    process.stdout.write('Dashboard build synchronized to worker manifest.\n');
}

runSync().catch((error) => {
    process.stderr.write(`Sync failed: ${error.message}\n`);
    process.exit(1);
});
