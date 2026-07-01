const test = require('node:test');
const assert = require('node:assert/strict');
const sqlite3 = require('sqlite3').verbose();
const {
  createIrsNotice,
  listOpenNotices,
  createNoticeResponse,
  createAuditWorkspaceCase,
  listAuditWorkspaceCases,
  createAuditWorkspaceTask,
  listAuditWorkspaceTasks,
  createNoticeIntakeWorkflow,
  getAuditWorkspaceDashboard,
  createEfileTransmission,
  getClientPortalAuditSummary,
  listLetterTemplates,
  renderLetterTemplate
} = require('../platform/audit-defense/service');

function createTestDb() {
  const db = new sqlite3.Database(':memory:');
  const schema = `
    CREATE TABLE clients (id TEXT PRIMARY KEY);
    CREATE TABLE offices (id TEXT PRIMARY KEY);
    CREATE TABLE auth_users (id TEXT PRIMARY KEY);
    CREATE TABLE defense_attorneys (id TEXT PRIMARY KEY);

    CREATE TABLE irs_notices (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      office_id TEXT,
      notice_type TEXT NOT NULL,
      notice_code TEXT NOT NULL,
      tax_year INTEGER,
      received_date TEXT NOT NULL,
      due_date TEXT,
      raw_document_url TEXT,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE notice_responses (
      id TEXT PRIMARY KEY,
      irs_notice_id TEXT NOT NULL,
      prepared_by_user_id TEXT,
      overseen_by_attorney_id TEXT,
      response_stage TEXT NOT NULL,
      draft_text TEXT,
      final_text TEXT,
      ai_assist_metadata TEXT,
      sent_date TEXT,
      delivery_method TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE audit_workspace_cases (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      client_return_id TEXT,
      protection_id TEXT,
      primary_notice_id TEXT,
      case_status TEXT NOT NULL,
      assigned_attorney_id TEXT,
      assigned_preparer_id TEXT,
      summary TEXT,
      ai_strategy_metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE audit_workspace_tasks (
      id TEXT PRIMARY KEY,
      workspace_case_id TEXT NOT NULL,
      task_label TEXT NOT NULL,
      task_status TEXT NOT NULL DEFAULT 'PENDING',
      due_date TEXT,
      created_by_user_id TEXT,
      completed_by_user_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    );

    CREATE TABLE audit_protection_plans (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      annual_price NUMERIC NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE client_audit_protection (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      client_return_id TEXT,
      plan_id TEXT NOT NULL,
      effective_date TEXT NOT NULL,
      expiration_date TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE transmissions (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      office_id TEXT,
      status TEXT NOT NULL DEFAULT 'READY',
      audit_protection_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO clients (id) VALUES ('client-001');
    INSERT INTO offices (id) VALUES ('office-001');
    INSERT INTO auth_users (id) VALUES ('user-001');
    INSERT INTO defense_attorneys (id) VALUES ('attorney-001');
    INSERT INTO defense_attorneys (id) VALUES ('attorney-edward-urquhart');
    INSERT INTO audit_protection_plans (id, code, name, annual_price) VALUES ('plan-001', 'AP_STD', 'Audit Protection Standard', 99.00);
    INSERT INTO client_audit_protection (id, client_id, plan_id, effective_date, status) VALUES ('cap-001', 'client-001', 'plan-001', '2026-01-01', 'ACTIVE');
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

test('audit defense notice intake and open notice query work for NEW status queue', async () => {
  const db = await createTestDb();
  const notice = await createIrsNotice(db, {
    id: 'notice-001',
    clientId: 'client-001',
    officeId: 'office-001',
    noticeType: 'CP',
    noticeCode: 'CP2000',
    taxYear: 2025,
    receivedDate: '2026-07-01',
    dueDate: '2026-07-20',
    rawDocumentUrl: 'https://example.invalid/cp2000.pdf'
  });

  assert.equal(notice.notice_code, 'CP2000');
  assert.equal(notice.status, 'NEW');

  const openNotices = await listOpenNotices(db);
  assert.equal(openNotices.length, 1);
  assert.equal(openNotices[0].id, 'notice-001');
  db.close();
});

test('notice response and audit protection workspace case/task lifecycle works', async () => {
  const db = await createTestDb();
  await createIrsNotice(db, {
    id: 'notice-002',
    clientId: 'client-001',
    officeId: 'office-001',
    noticeType: 'LTR',
    noticeCode: 'LTR12C',
    taxYear: 2024,
    receivedDate: '2026-07-01'
  });

  const response = await createNoticeResponse(db, {
    id: 'resp-001',
    irsNoticeId: 'notice-002',
    preparedByUserId: 'user-001',
    overseenByAttorneyId: 'attorney-001',
    responseStage: 'PRE_DEFENSE',
    draftText: 'Draft response text generated with AI and reviewed by preparer...',
    aiAssistMetadata: { model: 'andreaa-defense-v1', riskLevel: 'low' }
  });
  assert.equal(response.response_stage, 'PRE_DEFENSE');

  const workspaceCase = await createAuditWorkspaceCase(db, {
    id: 'case-001',
    clientId: 'client-001',
    primaryNoticeId: 'notice-002',
    caseStatus: 'OPEN',
    assignedAttorneyId: 'attorney-001',
    assignedPreparerId: 'user-001',
    summary: 'Initial defense case opened from IRS notice intake.'
  });
  assert.equal(workspaceCase.case_status, 'OPEN');

  const task = await createAuditWorkspaceTask(db, {
    id: 'task-001',
    workspaceCaseId: 'case-001',
    taskLabel: 'Draft CP2000 response',
    taskStatus: 'IN_PROGRESS',
    dueDate: '2026-07-10',
    createdByUserId: 'user-001'
  });
  assert.equal(task.task_status, 'IN_PROGRESS');

  const cases = await listAuditWorkspaceCases(db);
  const tasks = await listAuditWorkspaceTasks(db, 'case-001');
  assert.equal(cases.length, 1);
  assert.equal(tasks.length, 1);
  db.close();
});

test('letter templates provide AI-ready placeholder rendering for CP/LTR notices', () => {
  const templates = listLetterTemplates();
  assert.ok(templates.some((item) => item.code === 'CP2000'));
  assert.ok(templates.some((item) => item.code === 'CP501'));
  assert.ok(templates.some((item) => item.code === 'LTR12C'));

  const rendered = renderLetterTemplate({
    noticeCode: 'CP2000',
    taxpayerName: 'Jane Client',
    ssnLast4: '1234',
    taxYear: 2025,
    noticeDate: '2026-06-30',
    factsSummary: 'Income mismatch caused by corrected 1099 entry.',
    requestedRelief: 'Remove proposed adjustment and close notice.',
    preparerName: 'Taylor Preparer',
    attorneyName: 'Edward Dee Urquhart, Esq.'
  });

  assert.equal(rendered.code, 'CP2000');
  assert.match(rendered.body, /Jane Client/);
  assert.match(rendered.body, /Edward Dee Urquhart/);
  assert.equal(rendered.aiReadyMetadata.modelHint, 'andreaa-defense-v1');
});

test('notice intake workflow auto-creates case, assigns attorney, and creates starter task', async () => {
  const db = await createTestDb();
  const workflow = await createNoticeIntakeWorkflow(db, {
    clientId: 'client-001',
    officeId: 'office-001',
    assignedPreparerId: 'user-001',
    noticeType: 'CP',
    noticeCode: 'CP2000',
    taxYear: 2025,
    receivedDate: '2026-07-01',
    dueDate: '2026-07-15',
    riskLevel: 'high'
  });

  assert.equal(workflow.notice.notice_code, 'CP2000');
  assert.equal(workflow.workspaceCase.assigned_attorney_id, 'attorney-edward-urquhart');
  assert.equal(workflow.task.task_status, 'PENDING');
  assert.equal(workflow.aiStrategyMetadata.risk_level, 'high');

  const dashboard = await getAuditWorkspaceDashboard(db);
  assert.equal(dashboard.metrics.activeCases, 1);
  assert.equal(dashboard.metrics.noticesRequiringResponse, 1);
  db.close();
});

test('e-file transmission and client portal audit summary link to active audit protection', async () => {
  const db = await createTestDb();
  const transmission = await createEfileTransmission(db, {
    id: 'tx-001',
    clientId: 'client-001',
    officeId: 'office-001',
    status: 'READY',
    auditProtectionId: 'cap-001'
  });
  assert.equal(transmission.auditProtectionStatus, 'ACTIVE');

  await createAuditWorkspaceCase(db, {
    id: 'case-portal-001',
    clientId: 'client-001',
    caseStatus: 'OPEN',
    assignedAttorneyId: 'attorney-edward-urquhart',
    summary: 'Portal summary case'
  });

  const summary = await getClientPortalAuditSummary(db, 'client-001');
  assert.equal(summary.protection.planCode, 'AP_STD');
  assert.equal(summary.attorney.fullName, 'Edward Dee Urquhart, Esq.');
  assert.equal(summary.cases.length, 1);
  db.close();
});
