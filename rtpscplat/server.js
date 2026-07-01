const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {
  buildIntakeRecommendations,
  buildEnrollmentQuestionnaire,
  buildInterviewWizard,
  buildPreparerNotes,
  generateManualForms,
  searchBankProducts,
  scoreRisk,
  scanDocuments
} = require('./platform/ai/engine');
const { buildComplianceOverview, buildComplianceExportBundle } = require('./platform/compliance/engine');
const { buildTaxpayerConsentBundle } = require('./platform/compliance/consents');
const { buildRedactionWorkflow, buildPublicationComplianceBundle } = require('./platform/compliance/redaction');
const { buildVirtualServicePolicy, buildVirtualServicePolicyExport } = require('./platform/compliance/virtual-services');
const { buildPublicationChangeCenter, buildPublicationChangeExport } = require('./platform/compliance/publications');
const {
  buildExportPackage,
  buildEroBrandingProfile,
  buildLetterhead,
  buildFooter,
  buildDigitalOwnerSignatureBlock
} = require('./platform/export/engine');
const { createBackgroundWorkflow } = require('./platform/compliance/background-workflow');
const { createAutomationScheduler } = require('./platform/automation/scheduler');
const { createTaskManager } = require('./platform/automation/task-manager');
const { getEnvConfig } = require('./platform/auth/env-config');
const { registerMfaEnrollment, enableMfaEnrollment, verifyMfaChallenge, validateCredentialAccess } = require('./platform/auth/service');
const { getCloudflareRobotConfig, validateCloudflareRobotToken } = require('./platform/auth/cloudflare-robot');
const { buildIrsTaxProIntegration, buildIrsFormPacket, buildTransmissionValidationBundle } = require('./platform/irs/service');
const { listEsamApplications, getEsamApplicationSummary, getEsamOperationalReadiness } = require('./platform/irs/esam-service');
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
} = require('./platform/audit-defense/service');
const { runTspImportWorker } = require('./platform/workers/tsp-import-worker');
const {
  buildLedgerEntry,
  buildReconciliationSummary,
  buildWorkpaperBundle,
  buildRegistryEntry,
  buildWhiteLabelFinanceOverview
} = require('./platform/finance/engine');
const { buildPrefilePaymentGate, buildFinanceReconciliationTools } = require('./platform/finance/payment-gateway');
const { listServices, searchServices } = require('./platform/finance/services-catalog');

const PORT = 8080;
const DB_FILE = path.join(__dirname, 'ross_tax_pro.db');

function sendJson(res, body, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (req.url === '/api/status') {
    const db = new sqlite3.Database(DB_FILE);
    db.all('SELECT * FROM offices', [], (err, rows) => {
      sendJson(res, { status: 'ONLINE', database: err ? 'ERROR' : 'CONNECTED', offices: rows || [] });
      db.close();
    });
    return;
  }

  if (req.url === '/api/ai/intake' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const recommendations = buildIntakeRecommendations(body);
      sendJson(res, recommendations);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/enrollment-questionnaire' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const questionnaire = buildEnrollmentQuestionnaire(body);
      sendJson(res, questionnaire);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/interview-wizard' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const wizard = buildInterviewWizard(body);
      sendJson(res, wizard);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/manual-forms' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const forms = generateManualForms(body);
      sendJson(res, forms);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/notes' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const notes = buildPreparerNotes(body);
      sendJson(res, { notes });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/risk' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const risk = scoreRisk(body);
      sendJson(res, risk);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/ai/scan' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = scanDocuments(body.documents || []);
      sendJson(res, result);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/compliance/overview' && req.method === 'GET') {
    sendJson(res, buildComplianceOverview());
    return;
  }

  if (req.url === '/api/compliance/export' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const bundle = buildComplianceExportBundle(body);
      sendJson(res, bundle);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/compliance/consents' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const bundle = buildTaxpayerConsentBundle(body);
      sendJson(res, bundle);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/compliance/virtual-services/policy' && req.method === 'GET') {
    sendJson(res, buildVirtualServicePolicy());
    return;
  }

  if (req.url === '/api/compliance/virtual-services/export' && req.method === 'GET') {
    sendJson(res, buildVirtualServicePolicyExport());
    return;
  }

  if (req.url === '/api/compliance/publications/changes' && req.method === 'GET') {
    sendJson(res, buildPublicationChangeCenter());
    return;
  }

  if (req.url === '/api/compliance/publications/export' && req.method === 'GET') {
    sendJson(res, buildPublicationChangeExport());
    return;
  }

  if (req.url === '/api/export/branding' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const profile = buildEroBrandingProfile(body.brandingProfile || {});
      sendJson(res, {
        profile,
        letterhead: buildLetterhead(profile),
        footer: buildFooter(profile),
        signatureBlock: buildDigitalOwnerSignatureBlock(profile, body.signatureBlock || {})
      });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/export/package' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const payload = body.payload || { title: 'Export Package', body: 'No content provided.' };
      const options = body.options || {};
      sendJson(res, buildExportPackage(payload, options));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/overview' && req.method === 'GET') {
    sendJson(res, buildWhiteLabelFinanceOverview());
    return;
  }

  if (requestUrl.pathname === '/api/finance/services' && req.method === 'GET') {
    const category = requestUrl.searchParams.get('category') || undefined;
    const tier = requestUrl.searchParams.get('tier') || undefined;
    sendJson(res, { services: listServices({ category, tier }) });
    return;
  }

  if (req.url === '/api/finance/services/search' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, { services: searchServices(body.query || '') });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/payment-gate/prefile' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildPrefilePaymentGate(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/payment-gate/reconcile' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildFinanceReconciliationTools(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/config/sbtpg' && req.method === 'GET') {
    sendJson(res, getEnvConfig());
    return;
  }

  if (req.url === '/api/security/cloudflare/robot/config' && req.method === 'GET') {
    sendJson(res, getCloudflareRobotConfig());
    return;
  }

  if (req.url === '/api/security/cloudflare/robot/validate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await validateCloudflareRobotToken({
        token: body.token,
        remoteip: body.remoteip
      });
      sendJson(res, result, result.ok ? 200 : 400);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/auth/mfa/register' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, registerMfaEnrollment(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/auth/mfa/enable' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = enableMfaEnrollment(body);
      sendJson(res, result, result.ok ? 200 : 400);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/auth/mfa/verify' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = verifyMfaChallenge(body);
      sendJson(res, result, result.ok ? 200 : 401);
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/irs/integration' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const db = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(db, body.credentials || {}, 'RUN_EFILE');
      db.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const integration = buildIrsTaxProIntegration(body);
      const packet = buildIrsFormPacket(body);
      sendJson(res, { access, integration, packet });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/irs/transmission-validate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const db = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(db, body.credentials || {}, 'RUN_EFILE');
      db.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      sendJson(res, { access, validation: buildTransmissionValidationBundle(body) });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/irs/esam/applications' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }

      const db = new sqlite3.Database(DB_FILE);
      const applications = await listEsamApplications(db);
      db.close();
      sendJson(res, { access, applications });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/irs/esam/summary' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }

      const db = new sqlite3.Database(DB_FILE);
      const summary = await getEsamApplicationSummary(db, body.trackingNumber);
      db.close();
      if (!summary) {
        sendJson(res, { error: 'TRACKING_NUMBER_NOT_FOUND' }, 404);
        return;
      }

      sendJson(res, { access, summary });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/irs/esam/readiness' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }

      const db = new sqlite3.Database(DB_FILE);
      const readiness = await getEsamOperationalReadiness(db);
      db.close();
      sendJson(res, { access, readiness });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/notices' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const result = await createIrsNotice(db, body);
      db.close();
      sendJson(res, { access, notice: result });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/intake' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const workflow = await createNoticeIntakeWorkflow(db, body);
      db.close();
      sendJson(res, { access, workflow });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/notices/open' && req.method === 'GET') {
    try {
      const credentials = {
        username: requestUrl.searchParams.get('username') || '',
        password: requestUrl.searchParams.get('password') || '',
        mfaVerified: requestUrl.searchParams.get('mfaVerified') === 'true'
      };
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, credentials, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const notices = await listOpenNotices(db);
      db.close();
      sendJson(res, { access, notices });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/dashboard' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const dashboard = await getAuditWorkspaceDashboard(db);
      db.close();
      sendJson(res, { access, dashboard });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/responses' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const responseDraft = await createNoticeResponse(db, body);
      db.close();
      sendJson(res, { access, responseDraft });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-protection/cases' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const workspaceCase = await createAuditWorkspaceCase(db, body);
      db.close();
      sendJson(res, { access, workspaceCase });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (requestUrl.pathname === '/api/audit-protection/cases' && req.method === 'GET') {
    try {
      const credentials = {
        username: requestUrl.searchParams.get('username') || '',
        password: requestUrl.searchParams.get('password') || '',
        mfaVerified: requestUrl.searchParams.get('mfaVerified') === 'true'
      };
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, credentials, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const cases = await listAuditWorkspaceCases(db);
      db.close();
      sendJson(res, { access, cases });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-protection/tasks' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const db = new sqlite3.Database(DB_FILE);
      const task = await createAuditWorkspaceTask(db, body);
      db.close();
      sendJson(res, { access, task });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (requestUrl.pathname === '/api/audit-protection/tasks' && req.method === 'GET') {
    try {
      const credentials = {
        username: requestUrl.searchParams.get('username') || '',
        password: requestUrl.searchParams.get('password') || '',
        mfaVerified: requestUrl.searchParams.get('mfaVerified') === 'true'
      };
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, credentials, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }
      const workspaceCaseId = requestUrl.searchParams.get('workspaceCaseId');
      const db = new sqlite3.Database(DB_FILE);
      const tasks = await listAuditWorkspaceTasks(db, workspaceCaseId || undefined);
      db.close();
      sendJson(res, { access, tasks });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/audit-defense/letter-templates' && req.method === 'GET') {
    sendJson(res, { templates: listLetterTemplates() });
    return;
  }

  if (req.url === '/api/audit-defense/letter-templates/render' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, renderLetterTemplate(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/efile/transmissions' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, body.credentials || {}, 'RUN_EFILE');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }

      const db = new sqlite3.Database(DB_FILE);
      const transmission = await createEfileTransmission(db, body);
      db.close();
      sendJson(res, { access, transmission });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (requestUrl.pathname === '/api/client-portal/audit-protection' && req.method === 'GET') {
    try {
      const credentials = {
        username: requestUrl.searchParams.get('username') || '',
        password: requestUrl.searchParams.get('password') || '',
        mfaVerified: requestUrl.searchParams.get('mfaVerified') === 'true'
      };
      const authDb = new sqlite3.Database(DB_FILE);
      const access = await validateCredentialAccess(authDb, credentials, 'VIEW_CLIENT_PORTAL');
      authDb.close();
      if (!access.ok) {
        sendJson(res, { error: 'ROLE_BASED_ACCESS_DENIED', access }, 403);
        return;
      }

      const clientId = requestUrl.searchParams.get('clientId');
      if (!clientId) {
        sendJson(res, { error: 'clientId is required' }, 400);
        return;
      }

      const db = new sqlite3.Database(DB_FILE);
      const portalSummary = await getClientPortalAuditSummary(db, clientId);
      db.close();
      sendJson(res, { access, portalSummary });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/compliance/redaction' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const workflow = buildRedactionWorkflow(body);
      const bundle = buildPublicationComplianceBundle(body);
      sendJson(res, { workflow, bundle });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/compliance/background-workflow' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const workflow = createBackgroundWorkflow(body);
      sendJson(res, { workflow: workflow.run(), workflowState: workflow });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/automation/scheduler' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const scheduler = createAutomationScheduler(body);
      sendJson(res, { schedulerRun: scheduler.run(), schedulerState: scheduler });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/automation/task-manager' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const manager = createTaskManager(body);
      sendJson(res, { taskManagerRun: manager.run(), taskManagerState: manager });
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/workers/tsp-import' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, runTspImportWorker(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/bank/search' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, searchBankProducts(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/ledger' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildLedgerEntry(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/reconcile' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildReconciliationSummary(body.transactions || []));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/workpaper' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildWorkpaperBundle(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  if (req.url === '/api/finance/registry' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      sendJson(res, buildRegistryEntry(body));
    } catch (error) {
      sendJson(res, { error: error.message }, 400);
    }
    return;
  }

  let filePath = path.join(__dirname, 'ross_tax_pro_workspace', 'public', req.url === '/' ? 'index.xhtml' : req.url);
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.xhtml': 'application/xhtml+xml',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`[+] Web Server boot successful.`);
  console.log(`[→] Open your platform: http://localhost:${PORT}`);
});
