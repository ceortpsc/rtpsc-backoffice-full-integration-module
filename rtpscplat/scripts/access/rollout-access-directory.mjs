#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function runScript(relativePath, label) {
  const target = path.join(repoRoot, relativePath);
  const result = spawnSync(process.execPath, [target], {
    cwd: repoRoot,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    console.error(`[access:rollout] ${label} failed.`);
    process.exit(result.status ?? 1);
  }
}

runScript(path.join('scripts', 'access', 'apply-access-directory.mjs'), 'apply step');
runScript(path.join('scripts', 'access', 'validate-access-directory.mjs'), 'validation step');

console.log('[access:rollout] Access directory rollout completed successfully.');
