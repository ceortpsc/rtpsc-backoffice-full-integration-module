-- Enterprise identity, OAuth 2.0, RBAC, and client-file schema for Vantage DB
-- SQLite-compatible DDL for the current local runner

CREATE TABLE IF NOT EXISTS oauth_clients (
    id TEXT PRIMARY KEY,
    client_id TEXT UNIQUE NOT NULL,
    client_secret TEXT NOT NULL,
    name TEXT NOT NULL,
    app_type TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS oauth_tokens (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES oauth_clients(id),
    user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_users (
    id TEXT PRIMARY KEY,
    login_type TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    ssn TEXT,
    ptin TEXT,
    dob TEXT,
    id_card_type TEXT,
    id_card_number TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offices (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    parent_office_id TEXT REFERENCES offices(id),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS office_users (
    office_id TEXT NOT NULL REFERENCES offices(id),
    user_id TEXT NOT NULL REFERENCES auth_users(id),
    PRIMARY KEY (office_id, user_id)
);

CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT NOT NULL REFERENCES roles(id),
    permission_id TEXT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id TEXT NOT NULL REFERENCES auth_users(id),
    role_id TEXT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES auth_users(id),
    office_id TEXT REFERENCES offices(id),
    internal_client_code TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_files (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES clients(id),
    file_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS owner_credentials (
    id TEXT PRIMARY KEY,
    role_label TEXT NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    dl_number TEXT,
    dl_state TEXT,
    dl_expiration TEXT,
    height_feet INTEGER,
    height_inches INTEGER,
    weight_lbs INTEGER,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signature_cards (
    id TEXT PRIMARY KEY,
    owner_credential_id TEXT NOT NULL REFERENCES owner_credentials(id),
    signature_label TEXT NOT NULL,
    signature_image_url TEXT,
    authorized_modules TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO owner_credentials (
    id, role_label, full_name, username, password_hash, email, phone,
    dl_number, dl_state, dl_expiration, height_feet, height_inches, weight_lbs,
    address_line1, address_line2, city, state, zip
) VALUES (
    'owner-condre-ross', 'CEO_ERO_OWNER_DEVELOPER', 'Condre Dvon Ross', 'condreros', 'Houston1!',
    'ceo@rosstaxsoftware.com', '2544230594', '42624580', 'TX', '2032-06-09', 5, 7, 198,
    '2509 Cody Poe Rd', 'Unit B', 'Killeen', 'TX', '76549'
);

INSERT OR IGNORE INTO signature_cards (
    id, owner_credential_id, signature_label, authorized_modules
) VALUES (
    'sig-condre-ross', 'owner-condre-ross', 'Condre Dvon Ross, CEO / ERO Owner', 'E-File Center, MeF, Security Hub'
);

INSERT OR IGNORE INTO offices (id, code, name) VALUES
('office-254-kil-ero', '254-KIL-ERO', 'ROSS TAX PRO - KILLEEN ERO');

INSERT OR IGNORE INTO roles (id, code, name) VALUES
('role-ero-admin', 'ERO_ADMIN', 'ERO Administrator'),
('role-preparer', 'PREPARER', 'Tax Preparer'),
('role-auditor', 'AUDITOR', 'Compliance Auditor'),
('role-client', 'CLIENT', 'Client Portal User');

INSERT OR IGNORE INTO permissions (id, code, description) VALUES
('perm-view-returns', 'VIEW_RETURNS', 'View prepared returns'),
('perm-edit-returns', 'EDIT_RETURNS', 'Edit prepared returns'),
('perm-run-efile', 'RUN_EFILE', 'Submit returns through e-file workflows'),
('perm-view-client-portal', 'VIEW_CLIENT_PORTAL', 'Access the client-facing portal');

INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-ero-admin', 'perm-view-returns';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-ero-admin', 'perm-edit-returns';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-ero-admin', 'perm-run-efile';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-ero-admin', 'perm-view-client-portal';

INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-preparer', 'perm-view-returns';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-preparer', 'perm-edit-returns';

INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-auditor', 'perm-view-returns';
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-auditor', 'perm-run-efile';

INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-client', 'perm-view-client-portal';

INSERT OR IGNORE INTO auth_users (
    id, login_type, username, password_hash, email, phone,
    first_name, last_name, ssn, ptin, dob,
    id_card_type, id_card_number,
    address_line1, city, state, zip
) VALUES (
    'auth-ero-001', 'ERO_USER', 'ero.operator.001', 'replace_with_argon2_hash',
    'ero.operator.001@254tax.com', '+1-254-555-0001',
    'Jonathan', 'Sterling', NULL, 'P12345678', '1984-03-12',
    'DL', 'TX12345678', '2509 Cody Poe Rd Unit B', 'Killeen', 'TX', '76549'
);

INSERT OR IGNORE INTO auth_users (
    id, login_type, username, password_hash, email, phone,
    first_name, last_name, ssn, dob,
    address_line1, city, state, zip
) VALUES (
    'auth-client-001', 'CLIENT_USER', 'client.1040.2026.0001', 'replace_with_argon2_hash',
    'client@example.com', '+1-254-555-1000',
    'Maria', 'Lopez', '123-45-6789', '1990-07-21',
    '123 Main St', 'Killeen', 'TX', '76549'
);

INSERT OR IGNORE INTO user_roles (user_id, role_id)
SELECT 'auth-ero-001', 'role-ero-admin';

INSERT OR IGNORE INTO user_roles (user_id, role_id)
SELECT 'auth-client-001', 'role-client';

INSERT OR IGNORE INTO clients (id, user_id, office_id, internal_client_code)
VALUES ('client-001', 'auth-client-001', 'office-254-kil-ero', 'CLIENT-2026-0001');

INSERT OR IGNORE INTO client_files (id, client_id, file_type, file_name, file_url)
VALUES ('file-001', 'client-001', 'ID_CARD', 'client-id-card.pdf', 'https://example.invalid/files/client-id-card.pdf');

INSERT OR IGNORE INTO oauth_clients (id, client_id, client_secret, name, app_type, redirect_uri) VALUES
('oauth-ero-client', 'ero_client_prod_7719a8bc4', 'replace_with_argon2_hash', 'ROSS TAX PRO ERO Portal', 'ERO_PORTAL', 'https://workspace.rosstaxpro.com/console.xhtml'),
('oauth-client-portal', 'client_portal_prod_001', 'replace_with_argon2_hash', 'ROSS TAX PRO Client Portal', 'CLIENT_PORTAL', 'https://portal.rosstaxpro.com/callback');
