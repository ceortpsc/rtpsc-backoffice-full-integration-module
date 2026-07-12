-- Role and integration access directory extensions for RBAC profile enforcement

CREATE TABLE IF NOT EXISTS integration_endpoints (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    risk_tier TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_integration_access (
    role_id TEXT NOT NULL REFERENCES roles(id),
    integration_id TEXT NOT NULL REFERENCES integration_endpoints(id),
    access_level TEXT NOT NULL,
    PRIMARY KEY (role_id, integration_id)
);

INSERT OR IGNORE INTO permissions (id, code, description) VALUES
('perm-access-gateway', 'ACCESS_GATEWAY', 'Access unified gateway routing and protected API paths'),
('perm-access-irs-tunnel', 'ACCESS_IRS_TUNNEL', 'Use IRS communication tunnel integrations'),
('perm-access-mef-a2a', 'ACCESS_MEF_A2A', 'Use MeF A2A transmission integration'),
('perm-access-fire-transmission', 'ACCESS_FIRE_TRANSMISSION', 'Use FIRE information return transmission integration'),
('perm-access-mef-transmission', 'ACCESS_MEF_TRANSMISSION', 'Use MeF transmission orchestration module'),
('perm-access-identity-verification', 'ACCESS_IDENTITY_VERIFICATION', 'Use identity verification workflows and checks'),
('perm-access-tpp-reconciliation', 'ACCESS_TPP_RECONCILIATION', 'Use TPP reconciliation integration paths'),
('perm-access-ero-status', 'ACCESS_ERO_STATUS', 'Read and update ERO client status lifecycle data'),
('perm-access-masterfile', 'ACCESS_MASTERFILE', 'Read and update client masterfile records'),
('perm-access-tc-sync', 'ACCESS_TC_SYNC', 'Use transaction code synchronization services'),
('perm-access-refund-intelligence', 'ACCESS_REFUND_INTELLIGENCE', 'Use refund intelligence and tracking services'),
('perm-access-audit-logs', 'ACCESS_AUDIT_LOGS', 'Read protected audit records and access traces'),
('perm-manage-integrations', 'MANAGE_INTEGRATIONS', 'Manage integration credentials and access policy assignments');

INSERT OR IGNORE INTO integration_endpoints (id, code, name, risk_tier, description) VALUES
('int-gateway', 'GATEWAY', 'PractitionerHub Gateway', 'medium', 'Unified API ingress for application services'),
('int-irs-tunnel', 'IRS_TUNNEL', 'IRS Communication Tunnel', 'high', 'mTLS tunnel for transcript and account integrations'),
('int-mef-a2a', 'MEF_A2A', 'MeF A2A Engine', 'high', 'SOAP A2A machine-to-machine e-file transmission'),
('int-fire', 'FIRE_TRANSMISSION', 'FIRE Engine', 'high', 'SFTP information return transmission integration'),
('int-mef', 'MEF_TRANSMISSION', 'MeF Transmission', 'high', 'MeF package and acknowledgment orchestration'),
('int-identity', 'IDENTITY_VERIFY', 'Identity Verification', 'high', 'Identity checks and risk scoring operations'),
('int-tpp', 'TPP_RECON', 'TPP Reconciliation', 'high', 'Third-party payer reconciliation and variance workflows'),
('int-ero-status', 'ERO_STATUS', 'ERO Client Status', 'medium', 'Client lifecycle state tracking and escalation indicators'),
('int-masterfile', 'MASTERFILE', 'Client Masterfile', 'high', 'Authoritative client record and filing history storage'),
('int-tc-sync', 'TC_SYNC', 'TC Codes Sync', 'high', 'IRS transaction code synchronization and classification'),
('int-refund', 'REFUND_INTELLIGENCE', 'Refund Intelligence', 'medium', 'Refund timeline prediction and anomaly monitoring');

-- ERO_ADMIN role grants
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-gateway';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-irs-tunnel';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-mef-a2a';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-fire-transmission';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-mef-transmission';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-identity-verification';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-tpp-reconciliation';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-ero-status';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-masterfile';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-tc-sync';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-refund-intelligence';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-access-audit-logs';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-ero-admin', 'perm-manage-integrations';

-- PREPARER role grants
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-gateway';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-mef-a2a';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-fire-transmission';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-mef-transmission';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-identity-verification';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-ero-status';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-masterfile';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-tc-sync';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-preparer', 'perm-access-refund-intelligence';

-- AUDITOR role grants
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-gateway';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-irs-tunnel';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-tpp-reconciliation';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-ero-status';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-masterfile';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-tc-sync';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-refund-intelligence';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-auditor', 'perm-access-audit-logs';

-- CLIENT role grants
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) SELECT 'role-client', 'perm-access-refund-intelligence';

-- Integration-level access assignments
INSERT OR IGNORE INTO role_integration_access (role_id, integration_id, access_level) VALUES
('role-ero-admin', 'int-gateway', 'full'),
('role-ero-admin', 'int-irs-tunnel', 'full'),
('role-ero-admin', 'int-mef-a2a', 'full'),
('role-ero-admin', 'int-fire', 'full'),
('role-ero-admin', 'int-mef', 'full'),
('role-ero-admin', 'int-identity', 'full'),
('role-ero-admin', 'int-tpp', 'full'),
('role-ero-admin', 'int-ero-status', 'full'),
('role-ero-admin', 'int-masterfile', 'full'),
('role-ero-admin', 'int-tc-sync', 'full'),
('role-ero-admin', 'int-refund', 'full'),

('role-preparer', 'int-gateway', 'write'),
('role-preparer', 'int-mef-a2a', 'write'),
('role-preparer', 'int-fire', 'write'),
('role-preparer', 'int-mef', 'write'),
('role-preparer', 'int-identity', 'write'),
('role-preparer', 'int-ero-status', 'write'),
('role-preparer', 'int-masterfile', 'write'),
('role-preparer', 'int-tc-sync', 'read'),
('role-preparer', 'int-refund', 'read'),

('role-auditor', 'int-gateway', 'read'),
('role-auditor', 'int-irs-tunnel', 'read'),
('role-auditor', 'int-tpp', 'read'),
('role-auditor', 'int-ero-status', 'read'),
('role-auditor', 'int-masterfile', 'read'),
('role-auditor', 'int-tc-sync', 'read'),
('role-auditor', 'int-refund', 'read'),

('role-client', 'int-refund', 'own_only');
