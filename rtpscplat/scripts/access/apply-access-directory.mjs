#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const migrationScript = path.join(repoRoot, 'platform', 'db', 'migrate.js');

const result = spawnSync(process.execPath, [migrationScript], {
    cwd: repoRoot,
    stdio: 'inherit'
});

if (result.status !== 0) {
    console.error('[access:apply] Migration execution failed.');
    process.exit(result.status ?? 1);
}

console.log('[access:apply] Access directory migration applied successfully.');
