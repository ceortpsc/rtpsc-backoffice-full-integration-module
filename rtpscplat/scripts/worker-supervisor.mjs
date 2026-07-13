#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
function startProcess(command, name) {
    const child = spawn(command, {
        cwd: repoRoot,
        stdio: 'inherit',
        env: process.env,
        shell: true
    });

    child.on('exit', (code) => {
        console.error(`[workers:supervisor] ${name} exited with code ${code ?? 0}.`);
        process.exit(code ?? 0);
    });

    return child;
}

const dashboardProcess = startProcess('npm run dashboard:dev', 'dashboard:dev');
const workerProcess = startProcess('npx wrangler dev --config workers/dashboard-sync/wrangler.toml', 'wrangler');

function shutdown(signal) {
    if (!dashboardProcess.killed) {
        dashboardProcess.kill(signal);
    }
    if (!workerProcess.killed) {
        workerProcess.kill(signal);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));