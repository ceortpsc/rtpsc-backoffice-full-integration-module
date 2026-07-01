-- Service catalog and automated invoicing schema
-- SQLite-compatible enterprise pricing and billing automation

CREATE TABLE IF NOT EXISTS service_catalog (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    tier TEXT NOT NULL,
    description TEXT,
    unit_price NUMERIC NOT NULL,
    is_luxury INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    client_id TEXT,
    office_id TEXT,
    billing_profile TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    luxury_surcharge NUMERIC NOT NULL,
    tax_amount NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    due_date TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    service_code TEXT NOT NULL,
    service_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    line_subtotal NUMERIC NOT NULL,
    is_luxury INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO service_catalog (id, code, category, service_name, tier, description, unit_price, is_luxury) VALUES
('svc-001', 'ERO_ONBOARD_STD', 'Setup', 'ERO Platform Onboarding', 'Standard', 'Initial workspace activation and operator setup.', 299.00, 0),
('svc-002', 'ERO_ONBOARD_LX', 'Setup', 'ERO Platform Onboarding Concierge', 'Luxury', 'Executive onboarding with white-glove deployment support.', 1299.00, 1),
('svc-003', 'RETURN_1040_STD', 'Preparation', 'Form 1040 Preparation', 'Standard', 'Federal and state filing preparation with QA checks.', 349.00, 0),
('svc-004', 'RETURN_1040_LX', 'Preparation', 'Form 1040 Signature Concierge', 'Luxury', 'Priority handling, senior preparer review, and concierge submission.', 1299.00, 1),
('svc-005', 'BUSINESS_1120', 'Preparation', 'Business Return 1120/1120S', 'Premium', 'Business return preparation with entity compliance checks.', 1499.00, 0),
('svc-006', 'AUDIT_DEFENSE_STD', 'Defense', 'Audit Defense Response', 'Standard', 'Notice review and response drafting workflow.', 799.00, 0),
('svc-007', 'AUDIT_DEFENSE_ATTY', 'Defense', 'Attorney Oversight Defense', 'Luxury', 'Dedicated attorney oversight and escalated defense strategy.', 3499.00, 1),
('svc-008', 'IRS_TRANS_VALID', 'Compliance', 'IRS Transmission Validation', 'Premium', 'Identity, PIN/PTIN, consent, and 4883C validation gating.', 599.00, 0),
('svc-009', 'MFA_SECURITY_SUITE', 'Security', 'MFA Security Hardening', 'Premium', 'RBAC enforcement and MFA rollout for operators.', 899.00, 0),
('svc-010', 'API_INT_ESAM', 'Integration', 'IRS ESAM + API Client Integration', 'Luxury', 'API client wiring, callback validation, and readiness operations.', 2499.00, 1),
('svc-011', 'WORKSPACE_AUTOMATION', 'Automation', 'Task Manager and Scheduler Automation', 'Premium', 'Automation policy setup and operational workflow orchestration.', 999.00, 0),
('svc-012', 'CLIENT_PORTAL_LX', 'Client Experience', 'Client Portal Luxury Experience Pack', 'Luxury', 'Branded portal refinement and premium communications flow.', 1999.00, 1);
