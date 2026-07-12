#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3pkg from 'sqlite3';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const dbPath = path.join(repoRoot, 'ross_tax_pro.db');

const expectedPermissionCounts = {
    ERO_ADMIN: 17,
    PREPARER: 11,
    AUDITOR: 10,
    CLIENT: 2
};

const expectedIntegrationCounts = {
    ERO_ADMIN: 11,
    PREPARER: 9,
    AUDITOR: 7,
    CLIENT: 1
};

function all(db, sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)));
    });
}

function fail(message) {
    console.error(`[access:validate] ${message}`);
    process.exit(1);
}

const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
        fail(`Failed to open database at ${dbPath}: ${err.message}`);
    }

    try {
        const tables = await all(
            db,
            "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('integration_endpoints','role_integration_access') ORDER BY name"
        );

        if (tables.length !== 2) {
            fail('Missing required access directory tables.');
        }

        const permRows = await all(
            db,
            `SELECT r.code AS role_code, COUNT(*) AS permission_count
       FROM role_permissions rp
       JOIN roles r ON r.id = rp.role_id
       GROUP BY r.code`
        );

        const permMap = Object.fromEntries(
            permRows.map((row) => [row.role_code, Number(row.permission_count)])
        );

        for (const [role, count] of Object.entries(expectedPermissionCounts)) {
            if (permMap[role] !== count) {
                fail(`Permission count mismatch for ${role}. Expected ${count}, got ${permMap[role] ?? 0}.`);
            }
        }

        const integRows = await all(
            db,
            `SELECT r.code AS role_code, COUNT(*) AS integration_count
       FROM role_integration_access ria
       JOIN roles r ON r.id = ria.role_id
       GROUP BY r.code`
        );

        const integMap = Object.fromEntries(
            integRows.map((row) => [row.role_code, Number(row.integration_count)])
        );

        for (const [role, count] of Object.entries(expectedIntegrationCounts)) {
            if (integMap[role] !== count) {
                fail(`Integration count mismatch for ${role}. Expected ${count}, got ${integMap[role] ?? 0}.`);
            }
        }

        console.log('[access:validate] Access directory validation passed.');
    } catch (validationError) {
        fail(validationError.message);
    } finally {
        db.close();
    }
});
