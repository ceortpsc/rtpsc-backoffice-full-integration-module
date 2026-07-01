const SERVICE_CATALOG = [
  { code: 'SVC-001', name: 'Client Onboarding Essentials', category: 'Onboarding', tier: 'Standard', summary: 'Initial account setup and intake readiness.', explanation: 'Creates client profile, verifies baseline identity fields, and prepares the workspace for secure document intake.' },
  { code: 'SVC-002', name: 'Client Onboarding Concierge', category: 'Onboarding', tier: 'Luxury', summary: 'White-glove onboarding with guided support.', explanation: 'Includes dedicated onboarding specialist, high-touch setup walkthroughs, and accelerated readiness checks.' },
  { code: 'SVC-003', name: 'Virtual Enrollment Verification', category: 'Onboarding', tier: 'Premium', summary: 'Remote enrollment validation and quality controls.', explanation: 'Validates enrollment packets, confirms mandatory disclosures, and records compliance-ready enrollment evidence.' },
  { code: 'SVC-004', name: 'Identity Proofing Workflow', category: 'Security', tier: 'Premium', summary: 'Taxpayer identity validation before sensitive actions.', explanation: 'Applies identity proofing controls for account changes, authorization updates, and confidential tax data access.' },
  { code: 'SVC-005', name: 'MFA Enrollment and Recovery', category: 'Security', tier: 'Premium', summary: 'Multi-factor enrollment with backup recovery controls.', explanation: 'Deploys MFA enrollment procedures, backup code safeguards, and account recovery governance for operators and clients.' },
  { code: 'SVC-006', name: 'RBAC Access Governance', category: 'Security', tier: 'Premium', summary: 'Role-based access enforcement and review.', explanation: 'Maps permissions to job roles, restricts privileged actions, and records access approvals for audit traceability.' },
  { code: 'SVC-007', name: 'Form 1040 Preparation', category: 'Preparation', tier: 'Standard', summary: 'Federal individual return preparation.', explanation: 'Prepares Form 1040 with income, deductions, and credits while preserving workpaper references for review.' },
  { code: 'SVC-008', name: 'Form 1040NR Preparation', category: 'Preparation', tier: 'Premium', summary: 'Nonresident return preparation support.', explanation: 'Handles nonresident filing factors, treaty-sensitive fields, and compliance-aware documentation controls.' },
  { code: 'SVC-009', name: 'Business Return 1120/1120S', category: 'Preparation', tier: 'Premium', summary: 'Corporate return preparation and reconciliation.', explanation: 'Prepares business returns with ledger tie-outs, supporting schedules, and filing-package consistency checks.' },
  { code: 'SVC-010', name: 'Partnership Return 1065', category: 'Preparation', tier: 'Premium', summary: 'Partnership return and K-1 package workflow.', explanation: 'Coordinates partnership return data, partner allocations, and output packet readiness for filing and delivery.' },
  { code: 'SVC-011', name: 'Estate and Trust 1041', category: 'Preparation', tier: 'Premium', summary: 'Fiduciary return preparation services.', explanation: 'Supports fiduciary return assembly, beneficiary distribution reporting, and supporting statement management.' },
  { code: 'SVC-012', name: 'Extension Filing 4868/7004', category: 'Filing', tier: 'Standard', summary: 'Extension filing workflow automation.', explanation: 'Builds extension submissions, validates required fields, and records extension status for deadline governance.' },
  { code: 'SVC-013', name: 'Amended Return Processing', category: 'Preparation', tier: 'Premium', summary: 'Amended filing preparation and correction logic.', explanation: 'Constructs amendment narratives, corrected schedules, and substantiation records for audit-ready corrections.' },
  { code: 'SVC-014', name: 'State Return Preparation', category: 'Preparation', tier: 'Standard', summary: 'State filing preparation and matching.', explanation: 'Aligns federal-to-state mappings, applies state-specific rules, and prepares state package outputs.' },
  { code: 'SVC-015', name: 'Multi-State Filing Coordination', category: 'Preparation', tier: 'Luxury', summary: 'Complex multi-jurisdiction filing orchestration.', explanation: 'Coordinates multi-state compliance, source-income handling, and consolidated packet quality assurance.' },
  { code: 'SVC-016', name: 'E-File Transmission Packaging', category: 'Filing', tier: 'Premium', summary: 'E-file packet construction and routing.', explanation: 'Packages returns for transmission, validates schema constraints, and captures submission metadata for traceability.' },
  { code: 'SVC-017', name: 'E-File Reject Resolution', category: 'Filing', tier: 'Premium', summary: 'Reject-code remediation and resubmission.', explanation: 'Analyzes reject causes, applies data corrections, and manages controlled resubmission with status evidence.' },
  { code: 'SVC-018', name: 'IRS TaxPro Integration', category: 'Integration', tier: 'Premium', summary: 'IRS TaxPro account and workflow integration.', explanation: 'Connects IRS TaxPro operations to platform controls with credential-gated access and execution tracking.' },
  { code: 'SVC-019', name: 'Transmission Validation 4883C', category: 'Compliance', tier: 'Premium', summary: 'Identity and return-validation gate before filing.', explanation: 'Enforces PTIN/PIN, consent, attachment, and identity checks with 4883C XML generation and blocker logic.' },
  { code: 'SVC-020', name: 'CAF Packet Preparation', category: 'Compliance', tier: 'Standard', summary: 'CAF-ready authorization packet support.', explanation: 'Prepares 8821/2848 packet outputs, signature instructions, and submission readiness evidence.' },
  { code: 'SVC-021', name: 'Consent Packet Generation', category: 'Compliance', tier: 'Standard', summary: 'Taxpayer consent and disclosure packet creation.', explanation: 'Generates consent artifacts with timestamped acknowledgments and communication-safe language standards.' },
  { code: 'SVC-022', name: 'Retention Certification Bundle', category: 'Compliance', tier: 'Premium', summary: 'Retention package compliance validation.', explanation: 'Builds retention artifacts, checks required documents, and records archive certification completion.' },
  { code: 'SVC-023', name: 'Redaction and Encryption Workflow', category: 'Compliance', tier: 'Premium', summary: 'Sensitive-data redaction and encryption controls.', explanation: 'Applies redaction policies and encryption handling to documents before publication or third-party transmission.' },
  { code: 'SVC-024', name: 'Publication Compliance Review', category: 'Compliance', tier: 'Premium', summary: 'Release-readiness compliance checks.', explanation: 'Validates publication constraints, masking standards, and release approvals for external-facing documents.' },
  { code: 'SVC-025', name: 'CP2000 Defense Drafting', category: 'Audit Defense', tier: 'Premium', summary: 'CP2000 response drafting and evidence structuring.', explanation: 'Builds issue-specific defense drafts with fact narratives, relief requests, and support references.' },
  { code: 'SVC-026', name: 'CP501 Defense Drafting', category: 'Audit Defense', tier: 'Premium', summary: 'CP501 response and account-resolution strategy.', explanation: 'Drafts collections response language, payment support positioning, and administrative relief requests.' },
  { code: 'SVC-027', name: 'LTR12C Response Preparation', category: 'Audit Defense', tier: 'Premium', summary: 'LTR12C identity/information response package.', explanation: 'Compiles requested data elements, clarifies missing items, and structures IRS-ready response text.' },
  { code: 'SVC-028', name: 'Attorney Oversight Assignment', category: 'Audit Defense', tier: 'Luxury', summary: 'Attorney-led oversight for defense workflows.', explanation: 'Assigns Edward Dee Urquhart, Esq. for escalated review, strategy alignment, and legal-aware response quality.' },
  { code: 'SVC-029', name: 'Audit Workspace Case Management', category: 'Audit Defense', tier: 'Premium', summary: 'Case lifecycle tracking for defense matters.', explanation: 'Tracks notice intake, case status, tasks, and response chronology in one operational workspace.' },
  { code: 'SVC-030', name: 'Audit Task Board Automation', category: 'Audit Defense', tier: 'Premium', summary: 'Task assignment and due-date automation.', explanation: 'Creates case tasks, tracks completion states, and escalates overdue action items with audit evidence.' },
  { code: 'SVC-031', name: 'AI Draft Strategy Assist', category: 'AI', tier: 'Premium', summary: 'AI-assisted drafting and strategy recommendations.', explanation: 'Generates draft language, risk markers, and recommended strategy metadata for preparer review.' },
  { code: 'SVC-032', name: 'AI Intake Recommendation Engine', category: 'AI', tier: 'Premium', summary: 'Form and credit recommendation workflow.', explanation: 'Analyzes intake attributes and returns suggested forms, filing priorities, and preparer guidance notes.' },
  { code: 'SVC-033', name: 'AI Risk Scoring', category: 'AI', tier: 'Premium', summary: 'Return-level risk identification service.', explanation: 'Calculates operational risk indicators and flags high-priority review paths before submission.' },
  { code: 'SVC-034', name: 'Manual Forms Generation', category: 'Operations', tier: 'Standard', summary: 'Optional manual form packet generation.', explanation: 'Provides manual form outputs for exceptions, offline workflows, and controlled fallback operations.' },
  { code: 'SVC-035', name: 'Bank Product Search and Matching', category: 'Finance', tier: 'Standard', summary: 'Bank-product discovery and matching support.', explanation: 'Matches client profile and return context with eligible financial product offerings.' },
  { code: 'SVC-036', name: 'Ledger Posting Automation', category: 'Finance', tier: 'Premium', summary: 'Automated ledger entry generation.', explanation: 'Creates structured debit/credit entries with posting metadata for reconciliation workflows.' },
  { code: 'SVC-037', name: 'Reconciliation Operations', category: 'Finance', tier: 'Premium', summary: 'Balance reconciliation and variance controls.', explanation: 'Computes debit-credit variance, assigns status, and supports resolution workflows for out-of-balance items.' },
  { code: 'SVC-038', name: 'Workpaper Bundle Assembly', category: 'Finance', tier: 'Premium', summary: 'Workpaper package generation with controls.', explanation: 'Assembles compliant workpaper sets for financial evidence, review, and retention usage.' },
  { code: 'SVC-039', name: 'Registry Entry Automation', category: 'Finance', tier: 'Standard', summary: 'Compliance registry entry generation.', explanation: 'Produces labeled registry records for operations, audit tags, and filing-trace requirements.' },
  { code: 'SVC-040', name: 'Service Catalog Billing Profiles', category: 'Billing', tier: 'Premium', summary: 'Itemized pricing profile governance.', explanation: 'Maintains service-tier pricing structures for transparent quoting and invoicing consistency.' },
  { code: 'SVC-041', name: 'Luxury Service Packaging', category: 'Billing', tier: 'Luxury', summary: 'Premium package pricing and experience controls.', explanation: 'Groups concierge-level services into luxury package options with explicit scope and service promises.' },
  { code: 'SVC-042', name: 'Automated Invoice Drafting', category: 'Billing', tier: 'Premium', summary: 'Itemized invoice generation from services.', explanation: 'Builds invoice lines from selected services, quantities, and policy-driven pricing rules.' },
  { code: 'SVC-043', name: 'Invoice Approval Workflow', category: 'Billing', tier: 'Premium', summary: 'Controlled invoice review and release.', explanation: 'Routes invoices through review states with role-gated approvals before external delivery.' },
  { code: 'SVC-044', name: 'Renewal and Recurring Billing', category: 'Billing', tier: 'Premium', summary: 'Recurring service billing management.', explanation: 'Automates renewal reminders, recurring invoice creation, and billing-status transition tracking.' },
  { code: 'SVC-045', name: 'Cloudflare Sync Automation', category: 'Infrastructure', tier: 'Premium', summary: 'Cloudflare Pages/Workers sync support.', explanation: 'Coordinates build synchronization and deployment metadata for dashboard and worker integrations.' },
  { code: 'SVC-046', name: 'Background Scheduler Operations', category: 'Automation', tier: 'Premium', summary: 'Scheduled background task execution.', explanation: 'Runs queued operational tasks and reports scheduler status for observability and governance.' },
  { code: 'SVC-047', name: 'Task Manager Synchronization', category: 'Automation', tier: 'Premium', summary: 'Automated task-manager orchestration.', explanation: 'Executes synchronized task sets and tracks run state, count, and completion outcomes.' },
  { code: 'SVC-048', name: 'TSP Import Worker Service', category: 'Automation', tier: 'Premium', summary: 'TSP status normalization and import pipeline.', explanation: 'Normalizes status records, builds export bundles, and supports worker-driven integration processing.' },
  { code: 'SVC-049', name: 'Client Portal Audit Visibility', category: 'Client Portal', tier: 'Premium', summary: 'Client-facing audit-protection visibility.', explanation: 'Shows active protection plans, attorney assignment, and case updates within portal-safe boundaries.' },
  { code: 'SVC-050', name: 'Secure Document Gateway', category: 'Client Portal', tier: 'Premium', summary: 'Client document upload and controlled access.', explanation: 'Provides secure file intake with metadata tracking and restricted access by approved role policies.' },
  { code: 'SVC-051', name: 'ESAM Authorization Tracking', category: 'Compliance', tier: 'Premium', summary: 'IRS ESAM application and status tracking.', explanation: 'Tracks ESAM applications, authorized users, and readiness indicators for operational planning.' },
  { code: 'SVC-052', name: 'API Client Credential Governance', category: 'Integration', tier: 'Premium', summary: 'Client ID and callback governance workflow.', explanation: 'Maintains API client metadata, integration scope, and callback integrity controls.' },
  { code: 'SVC-053', name: 'Virtual Services Policy Governance', category: 'Compliance', tier: 'Premium', summary: 'Virtual-service policy requirements and handling controls.', explanation: 'Defines policy obligations, handling phases, and explanation standards for remote service delivery.' },
  { code: 'SVC-054', name: 'Operator Training and Runbook Enablement', category: 'Training', tier: 'Standard', summary: 'Operational runbook and process training.', explanation: 'Delivers process guidance, operational checklists, and staff readiness standards for consistent execution.' },
  { code: 'SVC-055', name: 'Enterprise Readiness Review', category: 'Advisory', tier: 'Luxury', summary: 'Executive readiness assessment and roadmap.', explanation: 'Performs end-to-end readiness review across security, compliance, operations, and growth strategy.' }
];

function listServices(options = {}) {
  const category = options.category ? String(options.category).toLowerCase() : null;
  const tier = options.tier ? String(options.tier).toLowerCase() : null;

  return SERVICE_CATALOG.filter((item) => {
    if (category && item.category.toLowerCase() !== category) return false;
    if (tier && item.tier.toLowerCase() !== tier) return false;
    return true;
  });
}

function getServiceByCode(code) {
  return SERVICE_CATALOG.find((item) => item.code === code) || null;
}

function searchServices(query = '') {
  const q = String(query).trim().toLowerCase();
  if (!q) return SERVICE_CATALOG;

  return SERVICE_CATALOG.filter((item) => {
    const haystack = `${item.code} ${item.name} ${item.category} ${item.tier} ${item.summary} ${item.explanation}`.toLowerCase();
    return haystack.includes(q);
  });
}

module.exports = {
  listServices,
  getServiceByCode,
  searchServices
};
