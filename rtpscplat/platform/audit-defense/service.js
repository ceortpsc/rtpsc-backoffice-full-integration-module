const NOTICE_STATUSES_OPEN = ['NEW', 'IN_REVIEW', 'DRAFT_RESPONSE'];
const DEFAULT_ATTORNEY_ID = 'attorney-edward-urquhart';
const DEFAULT_ATTORNEY_NAME = 'Edward Dee Urquhart, Esq.';

const LETTER_TEMPLATES = {
    CP2000: {
        code: 'CP2000',
        title: 'CP2000 Proposed Adjustment Response',
        body: [
            'IRS CP2000 Unit',
            '',
            'Re: Taxpayer {{taxpayerName}} (TIN ending {{ssnLast4}}), Tax Year {{taxYear}}',
            'Notice: CP2000 dated {{noticeDate}}',
            '',
            'This response addresses the proposed changes referenced in CP2000. The taxpayer disputes the proposed adjustment based on the attached support and corrected computations.',
            '',
            'Facts and explanation:',
            '{{factsSummary}}',
            '',
            'Requested action:',
            '{{requestedRelief}}',
            '',
            'Prepared by {{preparerName}} and overseen by {{attorneyName}}.',
            'Please direct correspondence to {{contactEmail}} / {{contactPhone}}.'
        ].join('\n')
    },
    CP501: {
        code: 'CP501',
        title: 'CP501 Balance Due Resolution Request',
        body: [
            'IRS Collections',
            '',
            'Re: Taxpayer {{taxpayerName}} (TIN ending {{ssnLast4}}), Tax Year {{taxYear}}',
            'Notice: CP501 dated {{noticeDate}}',
            '',
            'This submission requests account review and balance resolution. The taxpayer seeks administrative relief based on the enclosed records and payment verification.',
            '',
            'Support details:',
            '{{factsSummary}}',
            '',
            'Resolution requested:',
            '{{requestedRelief}}',
            '',
            'Prepared by {{preparerName}} with oversight by {{attorneyName}}.'
        ].join('\n')
    },
    LTR12C: {
        code: 'LTR12C',
        title: 'LTR12C Missing Information Response',
        body: [
            'IRS Return Integrity Unit',
            '',
            'Re: Taxpayer {{taxpayerName}} (TIN ending {{ssnLast4}}), Tax Year {{taxYear}}',
            'Notice: LTR12C dated {{noticeDate}}',
            '',
            'The taxpayer provides the requested identity/return support for LTR12C processing.',
            '',
            'Submitted documentation summary:',
            '{{factsSummary}}',
            '',
            'Requested processing action:',
            '{{requestedRelief}}',
            '',
            'Prepared by {{preparerName}} and reviewed by {{attorneyName}}.'
        ].join('\n')
    }
};

function run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function onRun(err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
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

function get(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

async function listOpenNotices(db) {
    const placeholders = NOTICE_STATUSES_OPEN.map(() => '?').join(', ');
    return all(
        db,
        `SELECT * FROM irs_notices WHERE status IN (${placeholders}) ORDER BY due_date IS NULL, due_date ASC, received_date DESC`,
        NOTICE_STATUSES_OPEN
    );
}

async function createIrsNotice(db, payload = {}) {
    const id = payload.id || `notice-${Date.now()}`;
    const status = payload.status || 'NEW';

    await run(
        db,
        `INSERT INTO irs_notices (
      id, client_id, office_id, notice_type, notice_code, tax_year,
      received_date, due_date, raw_document_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            payload.clientId,
            payload.officeId || null,
            payload.noticeType,
            payload.noticeCode,
            payload.taxYear || null,
            payload.receivedDate,
            payload.dueDate || null,
            payload.rawDocumentUrl || null,
            status
        ]
    );

    return get(db, 'SELECT * FROM irs_notices WHERE id = ?', [id]);
}

async function createNoticeResponse(db, payload = {}) {
    const id = payload.id || `response-${Date.now()}`;
    const metadata = JSON.stringify(payload.aiAssistMetadata || {});

    await run(
        db,
        `INSERT INTO notice_responses (
      id, irs_notice_id, prepared_by_user_id, overseen_by_attorney_id,
      response_stage, draft_text, final_text, ai_assist_metadata, sent_date, delivery_method
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            payload.irsNoticeId,
            payload.preparedByUserId || null,
            payload.overseenByAttorneyId || null,
            payload.responseStage,
            payload.draftText || null,
            payload.finalText || null,
            metadata,
            payload.sentDate || null,
            payload.deliveryMethod || null
        ]
    );

    return get(db, 'SELECT * FROM notice_responses WHERE id = ?', [id]);
}

async function createAuditWorkspaceCase(db, payload = {}) {
    const id = payload.id || `awc-${Date.now()}`;

    await run(
        db,
        `INSERT INTO audit_workspace_cases (
      id, client_id, client_return_id, protection_id, primary_notice_id,
      case_status, assigned_attorney_id, assigned_preparer_id, summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            payload.clientId,
            payload.clientReturnId || null,
            payload.protectionId || null,
            payload.primaryNoticeId || null,
            payload.caseStatus || 'OPEN',
            payload.assignedAttorneyId || null,
            payload.assignedPreparerId || null,
            payload.summary || null
        ]
    );

    return get(db, 'SELECT * FROM audit_workspace_cases WHERE id = ?', [id]);
}

async function listAuditWorkspaceCases(db) {
    return all(db, 'SELECT * FROM audit_workspace_cases ORDER BY updated_at DESC, created_at DESC');
}

async function createAuditWorkspaceTask(db, payload = {}) {
    const id = payload.id || `awt-${Date.now()}`;

    await run(
        db,
        `INSERT INTO audit_workspace_tasks (
      id, workspace_case_id, task_label, task_status, due_date, created_by_user_id, completed_by_user_id, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            payload.workspaceCaseId,
            payload.taskLabel,
            payload.taskStatus || 'PENDING',
            payload.dueDate || null,
            payload.createdByUserId || null,
            payload.completedByUserId || null,
            payload.completedAt || null
        ]
    );

    return get(db, 'SELECT * FROM audit_workspace_tasks WHERE id = ?', [id]);
}

async function listAuditWorkspaceTasks(db, workspaceCaseId) {
    if (workspaceCaseId) {
        return all(
            db,
            'SELECT * FROM audit_workspace_tasks WHERE workspace_case_id = ? ORDER BY due_date IS NULL, due_date ASC, created_at DESC',
            [workspaceCaseId]
        );
    }

    return all(db, 'SELECT * FROM audit_workspace_tasks ORDER BY due_date IS NULL, due_date ASC, created_at DESC');
}

function detectNoticeFromText(input = {}) {
    const rawText = String(input.rawText || '').toUpperCase();
    const inferredCode = ['CP2000', 'CP501', 'LTR12C'].find((code) => rawText.includes(code));
    let noticeType = input.noticeType;
    if (!noticeType) {
        noticeType = inferredCode && inferredCode.startsWith('CP') ? 'CP' : 'LTR';
    }

    return {
        noticeCode: input.noticeCode || inferredCode || 'CP2000',
        noticeType
    };
}

function buildAiStrategyMetadata(input = {}) {
    return {
        model: 'andreaa-defense-v1',
        risk_level: input.riskLevel || 'medium',
        notice_code: input.noticeCode || 'CP2000',
        recommended_strategy: input.recommendedStrategy || 'income mismatch reconciliation',
        auto_deadline: input.autoDeadline || input.dueDate || new Date(Date.now() + (1000 * 60 * 60 * 24 * 14)).toISOString().slice(0, 10)
    };
}

async function createNoticeIntakeWorkflow(db, payload = {}) {
    const detected = detectNoticeFromText(payload);
    const aiMetadata = buildAiStrategyMetadata({
        noticeCode: detected.noticeCode,
        riskLevel: payload.riskLevel,
        recommendedStrategy: payload.recommendedStrategy,
        dueDate: payload.dueDate,
        autoDeadline: payload.autoDeadline
    });

    const notice = await createIrsNotice(db, {
        id: payload.noticeId,
        clientId: payload.clientId,
        officeId: payload.officeId,
        noticeType: detected.noticeType,
        noticeCode: detected.noticeCode,
        taxYear: payload.taxYear,
        receivedDate: payload.receivedDate || new Date().toISOString().slice(0, 10),
        dueDate: payload.dueDate,
        rawDocumentUrl: payload.rawDocumentUrl,
        status: payload.noticeStatus || 'NEW'
    });

    const workspaceCase = await createAuditWorkspaceCase(db, {
        id: payload.workspaceCaseId,
        clientId: payload.clientId,
        clientReturnId: payload.clientReturnId,
        protectionId: payload.protectionId,
        primaryNoticeId: notice.id,
        caseStatus: payload.caseStatus || 'OPEN',
        assignedAttorneyId: payload.assignedAttorneyId || DEFAULT_ATTORNEY_ID,
        assignedPreparerId: payload.assignedPreparerId || null,
        summary: payload.summary || `Auto-created from ${detected.noticeCode} notice intake.`
    });

    await run(
        db,
        'UPDATE audit_workspace_cases SET ai_strategy_metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(aiMetadata), workspaceCase.id]
    );

    const task = await createAuditWorkspaceTask(db, {
        id: payload.taskId,
        workspaceCaseId: workspaceCase.id,
        taskLabel: `Draft ${detected.noticeCode} response`,
        taskStatus: 'PENDING',
        dueDate: aiMetadata.auto_deadline,
        createdByUserId: payload.assignedPreparerId || null
    });

    return {
        notice,
        workspaceCase: {
            ...workspaceCase,
            ai_strategy_metadata: JSON.stringify(aiMetadata)
        },
        defaultAttorney: {
            id: payload.assignedAttorneyId || DEFAULT_ATTORNEY_ID,
            fullName: DEFAULT_ATTORNEY_NAME
        },
        aiStrategyMetadata: aiMetadata,
        task
    };
}

async function getAuditWorkspaceDashboard(db) {
    const openNotices = await listOpenNotices(db);
    const cases = await listAuditWorkspaceCases(db);
    const tasks = await listAuditWorkspaceTasks(db);
    const today = new Date().toISOString().slice(0, 10);

    const deadlinesApproaching = openNotices.filter((item) => item.due_date && item.due_date <= today).length;
    const attorneyWorkload = cases.filter((item) => item.assigned_attorney_id === DEFAULT_ATTORNEY_ID && item.case_status !== 'CLOSED').length;
    const highRiskCases = cases.filter((item) => {
        try {
            const metadata = JSON.parse(item.ai_strategy_metadata || '{}');
            return metadata.risk_level === 'high';
        } catch (error) {
            return false;
        }
    }).length;

    return {
        attorney: {
            id: DEFAULT_ATTORNEY_ID,
            fullName: DEFAULT_ATTORNEY_NAME
        },
        metrics: {
            activeCases: cases.filter((item) => ['OPEN', 'ACTIVE', 'ACTIVE_DEFENSE'].includes(item.case_status)).length,
            noticesRequiringResponse: openNotices.length,
            deadlinesApproaching,
            attorneyWorkload,
            pendingTasks: tasks.filter((item) => item.task_status !== 'DONE').length,
            highRiskCases
        }
    };
}

async function createEfileTransmission(db, payload = {}) {
    const id = payload.id || `transmission-${Date.now()}`;
    const status = payload.status || 'READY';

    await run(
        db,
        `INSERT INTO transmissions (id, client_id, office_id, status, audit_protection_id)
     VALUES (?, ?, ?, ?, ?)`,
        [
            id,
            payload.clientId || null,
            payload.officeId || null,
            status,
            payload.auditProtectionId || null
        ]
    );

    const transmission = await get(db, 'SELECT * FROM transmissions WHERE id = ?', [id]);
    return {
        ...transmission,
        auditProtectionStatus: payload.auditProtectionId ? 'ACTIVE' : 'NONE',
        defenseCaseAutoOpenEligible: Boolean(payload.auditProtectionId)
    };
}

async function getClientPortalAuditSummary(db, clientId) {
    const protection = await get(
        db,
        `SELECT cap.*, app.code AS plan_code, app.name AS plan_name
     FROM client_audit_protection cap
     JOIN audit_protection_plans app ON app.id = cap.plan_id
     WHERE cap.client_id = ?
     ORDER BY cap.updated_at DESC, cap.created_at DESC
     LIMIT 1`,
        [clientId]
    );

    const cases = await all(
        db,
        'SELECT * FROM audit_workspace_cases WHERE client_id = ? ORDER BY updated_at DESC, created_at DESC',
        [clientId]
    );

    return {
        clientId,
        protection: protection ? {
            id: protection.id,
            status: protection.status,
            planCode: protection.plan_code,
            planName: protection.plan_name,
            effectiveDate: protection.effective_date,
            expirationDate: protection.expiration_date
        } : null,
        attorney: {
            id: DEFAULT_ATTORNEY_ID,
            fullName: DEFAULT_ATTORNEY_NAME
        },
        cases: cases.map((item) => ({
            id: item.id,
            caseStatus: item.case_status,
            primaryNoticeId: item.primary_notice_id,
            updatedAt: item.updated_at
        }))
    };
}

function listLetterTemplates() {
    return Object.values(LETTER_TEMPLATES).map((template) => ({
        code: template.code,
        title: template.title,
        placeholders: ['taxpayerName', 'ssnLast4', 'taxYear', 'noticeDate', 'factsSummary', 'requestedRelief', 'preparerName', 'attorneyName', 'contactEmail', 'contactPhone']
    }));
}

function renderLetterTemplate(payload = {}) {
    const template = LETTER_TEMPLATES[payload.noticeCode];
    if (!template) {
        throw new Error('Unsupported notice code for letter template rendering.');
    }

    const context = {
        taxpayerName: payload.taxpayerName || 'Taxpayer',
        ssnLast4: payload.ssnLast4 || '0000',
        taxYear: payload.taxYear || new Date().getUTCFullYear(),
        noticeDate: payload.noticeDate || new Date().toISOString().slice(0, 10),
        factsSummary: payload.factsSummary || 'Facts to be completed by preparer and reviewed by attorney.',
        requestedRelief: payload.requestedRelief || 'Request account adjustment per enclosed documentation.',
        preparerName: payload.preparerName || 'Assigned Preparer',
        attorneyName: payload.attorneyName || 'Defense Attorney',
        contactEmail: payload.contactEmail || 'support@rosstaxsoftware.com',
        contactPhone: payload.contactPhone || '+1-254-555-0000'
    };

    let body = template.body;
    Object.entries(context).forEach(([key, value]) => {
        body = body.replaceAll(`{{${key}}}`, String(value));
    });

    return {
        code: template.code,
        title: template.title,
        body,
        aiReadyMetadata: {
            modelHint: 'andreaa-defense-v1',
            riskLevel: payload.riskLevel || 'low',
            generatedAt: new Date().toISOString()
        }
    };
}

module.exports = {
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
    renderLetterTemplate,
    buildAiStrategyMetadata
};
