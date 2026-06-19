const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const CHECK_TARGETS = [
    'server.js',
    'vantage_db_driver.js',
    ...fs.readdirSync(path.join(ROOT, 'config'))
        .filter((file) => file.endsWith('.js'))
        .map((file) => path.join('config', file))
];
const REQUIRED_ASSETS = [
    'assets/rtpsc-logo.svg',
    'assets/rtpsc-theme.css',
    'report-engine.html',
    'advanced-presentation.html',
    'forms-cabinet.html',
    'billing-dashboard.html',
    'rosssign-pad.html'
];

function runNodeCheck(file) {
    const result = spawnSync(process.execPath, ['--check', file], { cwd: ROOT, encoding: 'utf8' });
    return { file, ok: result.status === 0, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function checkAsset(file) {
    return { file, ok: fs.existsSync(path.join(ROOT, file)) };
}

function main() {
    const mode = process.argv.includes('--repair') ? 'review-approved-repair' : 'dry-run';
    const syntax = CHECK_TARGETS.map(runNodeCheck);
    const assets = REQUIRED_ASSETS.map(checkAsset);
    const ok = syntax.every((item) => item.ok) && assets.every((item) => item.ok);
    const report = {
        worker: 'RTPSC Self-Healing Background Worker',
        mode,
        posture: 'diagnose-plan-review-before-repair',
        timestamp: new Date().toISOString(),
        ok,
        syntax,
        assets,
        repairPlan: ok ? [] : ['Review failed checks, create patch proposal, require human approval before code changes.']
    };

    console.log(JSON.stringify(report, null, 2));

    if (!ok) {
        process.exit(1);
    }
}

main();
