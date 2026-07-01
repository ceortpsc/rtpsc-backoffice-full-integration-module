-- IRS ESAM authorization management records
-- SQLite-compatible snapshot tables for operational readiness and compliance dashboards

CREATE TABLE IF NOT EXISTS irs_esam_profiles (
    id TEXT PRIMARY KEY,
    legal_name TEXT NOT NULL,
    dba_name TEXT,
    ein TEXT,
    ssn_masked TEXT,
    business_structure TEXT,
    business_address TEXT,
    business_city_state_postal TEXT,
    mailing_address TEXT,
    mailing_city_state_postal TEXT,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irs_esam_applications (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES irs_esam_profiles(id),
    application_type TEXT NOT NULL,
    tracking_number TEXT UNIQUE NOT NULL,
    application_status TEXT NOT NULL,
    module_label TEXT NOT NULL,
    source_url TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irs_esam_authorized_users (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES irs_esam_applications(id),
    full_name TEXT NOT NULL,
    role_label TEXT,
    toa_status TEXT,
    phone TEXT,
    email TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irs_esam_api_clients (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES irs_esam_applications(id),
    api_label TEXT NOT NULL,
    client_id TEXT,
    integration_types TEXT,
    redirect_url TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irs_esam_efin_etin (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES irs_esam_applications(id),
    record_type TEXT NOT NULL,
    record_value TEXT NOT NULL,
    status TEXT NOT NULL,
    effective_date TEXT,
    provider_option TEXT,
    service_type TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irs_esam_tcc_records (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES irs_esam_applications(id),
    role_label TEXT NOT NULL,
    forms TEXT,
    transmission_method TEXT,
    tcc TEXT,
    tcc_status TEXT,
    effective_date TEXT,
    tp_indicator TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO irs_esam_profiles (
    id, legal_name, dba_name, ein, ssn_masked, business_structure,
    business_address, business_city_state_postal,
    mailing_address, mailing_city_state_postal, phone
) VALUES (
    'esam-profile-ross-tax',
    'ROSS TAX PREP AND BOOKKEEPING',
    'ROSS TAX PRO SOFTWARE CO',
    '33-4891499',
    '***-**-6507',
    'Limited Liability Partnership',
    '2509 CODY POE RD UNIT B',
    'KILLEEN, TX 76549',
    '2509 CODY POE RD UNIT B',
    'KILLEEN, TX 76549',
    '(512) 489-6748'
);

INSERT OR IGNORE INTO irs_esam_applications (
    id, profile_id, application_type, tracking_number, application_status, module_label, source_url, completed_at
) VALUES
(
    'esam-app-api-client',
    'esam-profile-ross-tax',
    'API Client ID Application',
    '20260213013816217026',
    'Completed',
    'External Services Authorization Management',
    'https://la.www4.irs.gov/esrv/esam/pages/appApicViewSummary.xhtml#',
    '2026-02-13T01:38:16Z'
),
(
    'esam-app-aca-tcc',
    'esam-profile-ross-tax',
    'ACA Application for TCC',
    '20260214062622218643',
    'Completed',
    'External Services Authorization Management',
    'https://la.www4.irs.gov/esrv/esam/pages/appTccViewSummary.xhtml#',
    '2026-02-14T06:26:22Z'
),
(
    'esam-app-efile',
    'esam-profile-ross-tax',
    'e-File Application',
    '20250422015627906875',
    'Completed',
    'External Services Authorization Management',
    'https://la.www4.irs.gov/esrv/esam/pages/appEfileViewSummary.xhtml#',
    '2025-04-22T01:56:27Z'
),
(
    'esam-app-iris-tcc',
    'esam-profile-ross-tax',
    'IRIS Application for TCC',
    '20260214065015218647',
    'Completed',
    'External Services Authorization Management',
    'https://la.www4.irs.gov/esrv/esam/pages/appIrisViewSummary.xhtml#',
    '2026-02-14T06:50:15Z'
);

INSERT OR IGNORE INTO irs_esam_authorized_users (
    id, application_id, full_name, role_label, toa_status, phone, email
) VALUES
('esam-user-api-1', 'esam-app-api-client', 'Condre D Ross', 'Principal', 'Signed', '(512) 489-6749', 'ceo@rosstaxsoftware.com'),
('esam-user-aca-1', 'esam-app-aca-tcc', 'Condre D Ross', 'Responsible Official', 'Signed', '(512) 489-6748', 'ceo@rosstaxsoftware.com'),
('esam-user-aca-2', 'esam-app-aca-tcc', 'ALZOR COMEAUX', 'Responsible Official', 'Signed', '(512) 489-6748', NULL),
('esam-user-efile-1', 'esam-app-efile', 'Condre D Ross', 'Principal/Responsible Official/Primary Contact', 'Signed', '(254) 206-1037', NULL),
('esam-user-iris-1', 'esam-app-iris-tcc', 'Condre D Ross', 'Responsible Official', 'Signed', '(512) 489-6748', 'ceo@rosstaxsoftware.com');

INSERT OR IGNORE INTO irs_esam_api_clients (
    id, application_id, api_label, client_id, integration_types, redirect_url, status
) VALUES
(
  'esam-api-client-1',
  'esam-app-api-client',
  'etrac_realtime_refund_platform',
  '1280a487-33b6-4959-afb9-f1dd5c70fcc5',
  'SOR,TDS,TINM,IRISISP',
  'https://etrac.rosstaxsoftware.com/oauth/callback',
  'Active'
),
(
  'esam-api-client-2',
  'esam-app-api-client',
  'Ross Tax Pro Software Co | eTRAC Real-Time Refund Intelligence Platform',
  '04328388-02f2-4ebb-a3f4-1b1b51c9fa1a',
  'SOR,TDS,TINM,IRISISP',
  'https://etrac.rosstaxsoftware.com/oauth/callback',
  'Active'
);

INSERT OR IGNORE INTO irs_esam_efin_etin (
    id, application_id, record_type, record_value, status, effective_date, provider_option, service_type
) VALUES
('esam-efin-1', 'esam-app-efile', 'EFIN', '748335', 'Active', '2025-05-12T10:14:00Z', 'Electronic Return Originator', 'For Profit'),
('esam-etin-1', 'esam-app-efile', 'ETIN', '12181', 'Active', '2026-02-11T03:39:00Z', 'Online Provider', 'For Profit'),
('esam-etin-2', 'esam-app-efile', 'ETIN', '95409', 'Active', '2025-05-12T10:14:00Z', 'Transmitter', 'For Profit'),
('esam-etin-3', 'esam-app-efile', 'ETIN', '95410', 'Active', '2025-05-12T10:14:00Z', 'Software Developer', 'For Profit');

INSERT OR IGNORE INTO irs_esam_tcc_records (
    id, application_id, role_label, forms, transmission_method, tcc, tcc_status, effective_date, tp_indicator
) VALUES
('esam-tcc-aca-1', 'esam-app-aca-tcc', 'Issuer', '1094/1095B,1094/1095C', 'ISS-A2A', 'PTBRS9', 'Active', '2026-02-14T06:26:22Z', 'T'),
('esam-tcc-aca-2', 'esam-app-aca-tcc', 'Transmitter', '1094/1095B,1094/1095C', 'ISS-A2A', 'PTBRSB', 'Active', '2026-02-14T06:26:22Z', 'T'),
('esam-tcc-aca-3', 'esam-app-aca-tcc', 'Software Developer', '1094/1095B,1094/1095C', 'ISS-A2A', 'TTBRS8', 'Active', '2026-02-14T06:26:22Z', 'T'),
('esam-tcc-iris-1', 'esam-app-iris-tcc', 'Transmitter', '1099 Series & 1042-S', 'A2A', 'DH10B', 'Active', '2026-03-03T00:43:00Z', 'T'),
('esam-tcc-iris-2', 'esam-app-iris-tcc', 'Transmitter', '1099 Series & 1042-S', 'Portal', 'DH10C', 'Active', '2026-03-03T00:43:00Z', 'P'),
('esam-tcc-iris-3', 'esam-app-iris-tcc', 'Software Developer', '1099 Series & 1042-S', 'A2A', 'DH10D', 'Active', '2026-03-03T00:43:00Z', 'T');
