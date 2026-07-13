-- AI assistance permissions and audit logging schema

CREATE TABLE IF NOT EXISTS ai_assist_audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    username TEXT NOT NULL,
    permission_code TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    route TEXT NOT NULL,
    request_summary TEXT,
    response_status TEXT NOT NULL,
    metadata_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO permissions (id, code, description) VALUES
('perm-use-ai-assist', 'USE_AI_ASSIST', 'Use authenticated provider-backed AI assistance endpoints'),
('perm-access-ai-audit-logs', 'ACCESS_AI_AUDIT_LOGS', 'Read AI assistance audit logs and invocation traces');

INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-use-ai-assist';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-ai-audit-logs';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-use-ai-assist';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-ai-audit-logs';