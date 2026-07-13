#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function fail(message, code = 1) {
    console.error(`[ops:live:start] ${message}`);
    process.exit(code);
}

const migrateResult = spawnSync(process.execPath, [path.join(repoRoot, 'platform', 'db', 'migrate.js')], {
    cwd: repoRoot,
    stdio: 'inherit'
});

if (migrateResult.status !== 0) {
    fail('Migration bootstrap failed.', migrateResult.status ?? 1);
}

const serverProcess = spawn(process.execPath, [path.join(repoRoot, 'server.js')], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: {
        ...process.env,
        PORT: process.env.PORT || '8080'
    }
});

function shutdown(signal) {
    if (!serverProcess.killed) {
        serverProcess.kill(signal);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

serverProcess.on('exit', (code) => {
    process.exit(code ?? 0);
});