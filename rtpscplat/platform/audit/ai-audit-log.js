const crypto = require('crypto');

function run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function onRun(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

function all(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function createAiAuditLog(db, payload = {}) {
    const id = payload.id || `ai-audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    await run(
        db,
        `INSERT INTO ai_assist_audit_logs (
      id, user_id, username, permission_code, provider, model, route, request_summary, response_status, metadata_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            payload.userId || null,
            payload.username || 'unknown',
            payload.permissionCode || 'USE_AI_ASSIST',
            payload.provider || 'unconfigured',
            payload.model || 'unconfigured',
            payload.route || 'unknown',
            payload.requestSummary || null,
            payload.responseStatus || 'UNKNOWN',
            JSON.stringify(payload.metadata || {})
        ]
    );
    return { id, createdAt: new Date().toISOString() };
}

async function listAiAuditLogs(db, limit = 50) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
    return all(
        db,
        `SELECT id, user_id, username, permission_code, provider, model, route, request_summary, response_status, metadata_json, created_at
     FROM ai_assist_audit_logs
     ORDER BY datetime(created_at) DESC
     LIMIT ?`,
        [safeLimit]
    );
}

module.exports = {
    createAiAuditLog,
    listAiAuditLogs
};