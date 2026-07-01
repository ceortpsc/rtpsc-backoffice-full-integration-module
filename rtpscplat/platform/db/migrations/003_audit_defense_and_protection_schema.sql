-- Audit defense workspace, IRS notice intake, and audit protection product schema
-- SQLite-compatible DDL for local runtime

CREATE TABLE IF NOT EXISTS defense_attorneys (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    full_name TEXT NOT NULL,
    bar_number TEXT,
    jurisdiction TEXT,
    email TEXT,
    phone TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO defense_attorneys (
    id, full_name, bar_number, jurisdiction, email, phone
) VALUES (
    'attorney-edward-urquhart',
    'Edward Dee Urquhart, Esq',
    'BAR-EDU-0001',
    'TX',
    'edu@auditdefensehub.com',
    '+1-254-555-9000'
);

CREATE TABLE IF NOT EXISTS irs_notices (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    client_id TEXT NOT NULL REFERENCES clients(id),
    office_id TEXT REFERENCES offices(id),
    notice_type TEXT NOT NULL,
    notice_code TEXT NOT NULL,
    tax_year INTEGER,
    received_date TEXT NOT NULL,
    due_date TEXT,
    raw_document_url TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notice_responses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    irs_notice_id TEXT NOT NULL REFERENCES irs_notices(id),
    prepared_by_user_id TEXT REFERENCES auth_users(id),
    overseen_by_attorney_id TEXT REFERENCES defense_attorneys(id),
    response_stage TEXT NOT NULL,
    draft_text TEXT,
    final_text TEXT,
    ai_assist_metadata TEXT,
    sent_date TEXT,
    delivery_method TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_cases (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    client_id TEXT NOT NULL REFERENCES clients(id),
    office_id TEXT REFERENCES offices(id),
    primary_notice_id TEXT REFERENCES irs_notices(id),
    case_status TEXT NOT NULL,
    assigned_attorney_id TEXT REFERENCES defense_attorneys(id),
    assigned_preparer_id TEXT REFERENCES auth_users(id),
    strategy_notes TEXT,
    ai_strategy_metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_protection_plans (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    coverage_scope TEXT,
    annual_price NUMERIC NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO audit_protection_plans (
    id, code, name, description, coverage_scope, annual_price
) VALUES
(
    'plan-ap-std',
    'AP_STD',
    'Audit Protection Standard',
    'Core IRS notice response support and preparer drafting assistance.',
    'CP/LTR intake, one draft cycle, and preparer support',
    99.00
),
(
    'plan-ap-premium',
    'AP_PREMIUM',
    'Audit Protection Premium',
    'Expanded attorney oversight, escalations, and filing support.',
    'Includes defense strategy review and escalation handling',
    199.00
),
(
    'plan-ap-business',
    'AP_BUSINESS',
    'Audit Protection Business',
    'Business-return specific defense and multi-notice handling.',
    'Multi-period, multi-notice defense for business clients',
    299.00
);

CREATE TABLE IF NOT EXISTS client_returns (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES clients(id),
    tax_year INTEGER,
    return_type TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_audit_protection (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    client_id TEXT NOT NULL REFERENCES clients(id),
    client_return_id TEXT REFERENCES client_returns(id),
    plan_id TEXT NOT NULL REFERENCES audit_protection_plans(id),
    effective_date TEXT NOT NULL,
    expiration_date TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (client_id, client_return_id, plan_id)
);

CREATE TABLE IF NOT EXISTS audit_workspace_cases (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    client_id TEXT NOT NULL REFERENCES clients(id),
    client_return_id TEXT REFERENCES client_returns(id),
    protection_id TEXT REFERENCES client_audit_protection(id),
    primary_notice_id TEXT REFERENCES irs_notices(id),
    case_status TEXT NOT NULL,
    assigned_attorney_id TEXT REFERENCES defense_attorneys(id),
    assigned_preparer_id TEXT REFERENCES auth_users(id),
    summary TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_workspace_tasks (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    workspace_case_id TEXT NOT NULL REFERENCES audit_workspace_cases(id),
    task_label TEXT NOT NULL,
    task_status TEXT NOT NULL DEFAULT 'PENDING',
    due_date TEXT,
    created_by_user_id TEXT REFERENCES auth_users(id),
    completed_by_user_id TEXT REFERENCES auth_users(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT
);

CREATE TABLE IF NOT EXISTS transmissions (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES clients(id),
    office_id TEXT REFERENCES offices(id),
    status TEXT NOT NULL DEFAULT 'READY',
    audit_protection_id TEXT REFERENCES client_audit_protection(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
