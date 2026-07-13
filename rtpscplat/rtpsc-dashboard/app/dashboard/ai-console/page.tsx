'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Credentials = {
    username: string;
    password: string;
    mfaToken: string;
    backupCode: string;
};

type AuditLogItem = {
    id: number;
    route: string;
    response_status: string;
    provider: string;
    model: string;
    username: string;
    created_at: string;
    metadata?: Record<string, unknown>;
};

const defaultCredentials: Credentials = {
    username: 'condreros',
    password: '',
    mfaToken: '',
    backupCode: ''
};

const SESSION_CREDENTIALS_KEY = 'vantage-avalon-ai-console-credentials-v1';

const quickActions = [
    {
        label: 'Run Operations Summary',
        taskType: 'operations_summary',
        prompt: 'Summarize current MEF transmission control priorities, refund intelligence risk exposure, and unresolved ledger variance actions for today.',
        context: {
            lane: 'mef-transmission',
            domain: 'refund-intelligence',
            focus: 'balanced-ledger-variance-reconciliation'
        }
    },
    {
        label: 'Run Notice Response Strategy',
        taskType: 'notice_response_strategy',
        prompt: 'Draft an IRM-aligned response strategy for active CP and LTR notices, including required evidence packets, escalation actions, and reviewer cautions.',
        context: {
            lane: 'notice-response-engine',
            forms: ['CP', 'LTR'],
            controls: ['irm-guided', 'compliance-tax-law', 'letter-generation']
        }
    }
];

export default function AiConsolePage() {
    const [credentials, setCredentials] = useState<Credentials>(defaultCredentials);
    const [taskType, setTaskType] = useState('operations_summary');
    const [prompt, setPrompt] = useState('Summarize the top filing control priorities for high-risk open notices.');
    const [contextJson, setContextJson] = useState('{"office":"254-KIL-ERO","queue":"priority"}');
    const [temperature, setTemperature] = useState('0.2');
    const [assistStatus, setAssistStatus] = useState<string>('Idle');
    const [assistPayload, setAssistPayload] = useState<Record<string, unknown> | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(SESSION_CREDENTIALS_KEY);
            if (!saved) {
                return;
            }
            const parsed = JSON.parse(saved) as Partial<Credentials>;
            setCredentials((current) => ({
                ...current,
                username: parsed.username || current.username,
                password: parsed.password || '',
                mfaToken: parsed.mfaToken || '',
                backupCode: parsed.backupCode || ''
            }));
        } catch {
            sessionStorage.removeItem(SESSION_CREDENTIALS_KEY);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem(SESSION_CREDENTIALS_KEY, JSON.stringify(credentials));
    }, [credentials]);

    const contextValue = useMemo(() => {
        const trimmed = contextJson.trim();
        if (!trimmed) {
            return {};
        }
        try {
            return JSON.parse(trimmed);
        } catch {
            return { rawContext: trimmed };
        }
    }, [contextJson]);

    async function handleAssist(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await submitAssist(taskType, prompt, contextValue);
    }

    async function submitAssist(nextTaskType: string, nextPrompt: string, nextContext: unknown) {
        setIsSending(true);
        setAssistStatus('Submitting request...');
        setAssistPayload(null);

        try {
            const response = await fetch('/api/ai/provider/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credentials,
                    taskType: nextTaskType,
                    prompt: nextPrompt,
                    context: nextContext,
                    temperature: Number(temperature)
                })
            });
            const payload = await response.json();
            setAssistPayload(payload);
            setAssistStatus(response.ok ? 'Assist call succeeded.' : `Assist call failed (${response.status}).`);
        } catch (error) {
            setAssistStatus(error instanceof Error ? error.message : 'Assist call failed.');
        } finally {
            setIsSending(false);
        }
    }

    async function runQuickAction(action: (typeof quickActions)[number]) {
        setTaskType(action.taskType);
        setPrompt(action.prompt);
        setContextJson(JSON.stringify(action.context));
        await submitAssist(action.taskType, action.prompt, action.context);
    }

    async function loadAuditLogs() {
        setIsLoadingAudit(true);
        try {
            const params = new URLSearchParams({
                username: credentials.username,
                password: credentials.password,
                limit: '10'
            });
            if (credentials.mfaToken) {
                params.set('mfaToken', credentials.mfaToken);
            }
            if (credentials.backupCode) {
                params.set('backupCode', credentials.backupCode);
            }

            const response = await fetch(`/api/ai/provider/audit?${params.toString()}`);
            const payload = await response.json();
            if (response.ok && Array.isArray(payload.logs)) {
                setAuditLogs(payload.logs);
            } else {
                setAuditLogs([]);
                setAssistPayload(payload);
                setAssistStatus(`Audit fetch failed (${response.status}).`);
            }
        } catch (error) {
            setAuditLogs([]);
            setAssistStatus(error instanceof Error ? error.message : 'Audit fetch failed.');
        } finally {
            setIsLoadingAudit(false);
        }
    }

    return (
        <section className="page-shell">
            <header className="page-header">
                <p className="eyebrow">AI OPS CONSOLE</p>
                <h1>Authenticated AI Control Surface</h1>
                <p>
                    Execute provider-backed AI requests using credential + MFA controls and inspect live audit trails.
                </p>
            </header>

            <form className="ai-console-grid" onSubmit={handleAssist}>
                <article className="ai-card">
                    <h2>Operator Credentials</h2>
                    <p className="status-line">Credentials are masked and stored in session for this browser tab.</p>
                    <label>
                        Username
                        <input
                            value={credentials.username}
                            onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        MFA Token (optional)
                        <input
                            value={credentials.mfaToken}
                            onChange={(event) => setCredentials({ ...credentials, mfaToken: event.target.value })}
                        />
                    </label>
                    <label>
                        Backup Code (optional)
                        <input
                            value={credentials.backupCode}
                            onChange={(event) => setCredentials({ ...credentials, backupCode: event.target.value })}
                        />
                    </label>
                </article>

                <article className="ai-card">
                    <h2>Assist Request</h2>
                    <div className="quick-actions">
                        {quickActions.map((action) => (
                            <button
                                key={action.taskType}
                                type="button"
                                onClick={() => runQuickAction(action)}
                                disabled={isSending}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                    <label>
                        Task Type
                        <input value={taskType} onChange={(event) => setTaskType(event.target.value)} />
                    </label>
                    <label>
                        Temperature
                        <input
                            value={temperature}
                            onChange={(event) => setTemperature(event.target.value)}
                            inputMode="decimal"
                        />
                    </label>
                    <label>
                        Prompt
                        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} />
                    </label>
                    <label>
                        Context JSON
                        <textarea value={contextJson} onChange={(event) => setContextJson(event.target.value)} rows={6} />
                    </label>
                    <div className="ai-actions">
                        <button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Call Assist Endpoint'}</button>
                        <button type="button" onClick={loadAuditLogs} disabled={isLoadingAudit}>
                            {isLoadingAudit ? 'Loading...' : 'Load Audit Logs'}
                        </button>
                    </div>
                </article>
            </form>

            <section className="ai-result-grid">
                <article className="ai-card">
                    <h2>Assist Response</h2>
                    <p className="status-line">{assistStatus}</p>
                    <pre>{JSON.stringify(assistPayload, null, 2)}</pre>
                </article>

                <article className="ai-card">
                    <h2>Recent Audit Entries</h2>
                    <div className="table-shell">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Route</th>
                                    <th>Status</th>
                                    <th>Provider</th>
                                    <th>Model</th>
                                    <th>User</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.id}</td>
                                        <td>{entry.route}</td>
                                        <td>{entry.response_status}</td>
                                        <td>{entry.provider}</td>
                                        <td>{entry.model}</td>
                                        <td>{entry.username}</td>
                                        <td>{entry.created_at}</td>
                                    </tr>
                                ))}
                                {auditLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={7}>No audit logs loaded.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>
            </section>
        </section>
    );
}