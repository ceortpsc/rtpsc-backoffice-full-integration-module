export type CaseStatus = 'intake' | 'review' | 'ready_to_file' | 'transmitted' | 'follow_up';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface CaseItem {
    id: string;
    taxpayerName: string;
    noticeCode: string;
    status: CaseStatus;
    owner: string;
    dueDate: string;
    risk: Severity;
    balanceAtRisk: number;
}

export interface TransmissionItem {
    id: string;
    caseId: string;
    channel: 'MeF' | 'A2A' | 'FIRE';
    submittedAt: string;
    ackStatus: 'accepted' | 'rejected' | 'pending';
    retries: number;
    ackCode: string;
}

export interface ReconciliationItem {
    id: string;
    caseId: string;
    ledgerState: 'balanced' | 'variance';
    expectedAmount: number;
    settledAmount: number;
    varianceAmount: number;
    settlementDate: string;
}

export interface ComplianceAlert {
    id: string;
    title: string;
    severity: Severity;
    control: string;
    owner: string;
    openedAt: string;
    status: 'open' | 'investigating' | 'resolved';
}

export interface ClientAccount {
    id: string;
    legalName: string;
    filingType: '1040' | '1065' | '1120' | '1120S';
    authorityStatus: 'validated' | 'expires_soon' | 'missing';
    activeCases: number;
    lastContactAt: string;
}

export const cases: CaseItem[] = [
    {
        id: 'CASE-2401',
        taxpayerName: 'Alpine River Holdings LLC',
        noticeCode: 'CP2000',
        status: 'review',
        owner: 'R. Delgado',
        dueDate: '2026-07-22',
        risk: 'high',
        balanceAtRisk: 18425
    },
    {
        id: 'CASE-2402',
        taxpayerName: 'Marta Ellison',
        noticeCode: 'LTR12C',
        status: 'intake',
        owner: 'K. Harmon',
        dueDate: '2026-07-18',
        risk: 'medium',
        balanceAtRisk: 0
    },
    {
        id: 'CASE-2403',
        taxpayerName: 'Sierra Crest Transport Inc.',
        noticeCode: 'CP504',
        status: 'ready_to_file',
        owner: 'T. Nguyen',
        dueDate: '2026-07-16',
        risk: 'critical',
        balanceAtRisk: 92760
    },
    {
        id: 'CASE-2404',
        taxpayerName: 'Glenford Medical Group',
        noticeCode: 'LTR3219C',
        status: 'follow_up',
        owner: 'A. Patel',
        dueDate: '2026-07-30',
        risk: 'high',
        balanceAtRisk: 41620
    },
    {
        id: 'CASE-2405',
        taxpayerName: 'Denali Orchard Partners',
        noticeCode: 'CP14',
        status: 'transmitted',
        owner: 'C. Ruiz',
        dueDate: '2026-08-04',
        risk: 'low',
        balanceAtRisk: 6220
    }
];

export const transmissions: TransmissionItem[] = [
    {
        id: 'TX-9821',
        caseId: 'CASE-2405',
        channel: 'MeF',
        submittedAt: '2026-07-12T09:18:00Z',
        ackStatus: 'accepted',
        retries: 0,
        ackCode: 'ACK-01'
    },
    {
        id: 'TX-9822',
        caseId: 'CASE-2403',
        channel: 'A2A',
        submittedAt: '2026-07-12T10:04:00Z',
        ackStatus: 'pending',
        retries: 1,
        ackCode: 'PENDING'
    },
    {
        id: 'TX-9823',
        caseId: 'CASE-2404',
        channel: 'MeF',
        submittedAt: '2026-07-11T18:41:00Z',
        ackStatus: 'rejected',
        retries: 2,
        ackCode: 'R0000-902-01'
    }
];

export const reconciliation: ReconciliationItem[] = [
    {
        id: 'REC-5101',
        caseId: 'CASE-2405',
        ledgerState: 'balanced',
        expectedAmount: 6220,
        settledAmount: 6220,
        varianceAmount: 0,
        settlementDate: '2026-07-12'
    },
    {
        id: 'REC-5102',
        caseId: 'CASE-2403',
        ledgerState: 'variance',
        expectedAmount: 92760,
        settledAmount: 92010,
        varianceAmount: -750,
        settlementDate: '2026-07-12'
    },
    {
        id: 'REC-5103',
        caseId: 'CASE-2404',
        ledgerState: 'variance',
        expectedAmount: 41620,
        settledAmount: 41180,
        varianceAmount: -440,
        settlementDate: '2026-07-11'
    }
];

export const complianceAlerts: ComplianceAlert[] = [
    {
        id: 'CMP-77',
        title: 'POA expiration within seven days for active client account',
        severity: 'high',
        control: 'AUTH-POA-LIFECYCLE',
        owner: 'Compliance Desk',
        openedAt: '2026-07-12T08:00:00Z',
        status: 'open'
    },
    {
        id: 'CMP-78',
        title: 'Transmission reject code cluster above threshold',
        severity: 'critical',
        control: 'MEF-NACK-CONTROL',
        owner: 'Transmission Ops',
        openedAt: '2026-07-12T10:10:00Z',
        status: 'investigating'
    },
    {
        id: 'CMP-79',
        title: 'Custodial variance unresolved beyond SLA window',
        severity: 'medium',
        control: 'LEDGER-RECON-SLA',
        owner: 'Finance Control',
        openedAt: '2026-07-11T19:30:00Z',
        status: 'open'
    }
];

export const clients: ClientAccount[] = [
    {
        id: 'CL-001',
        legalName: 'Alpine River Holdings LLC',
        filingType: '1065',
        authorityStatus: 'validated',
        activeCases: 1,
        lastContactAt: '2026-07-12T09:40:00Z'
    },
    {
        id: 'CL-002',
        legalName: 'Marta Ellison',
        filingType: '1040',
        authorityStatus: 'expires_soon',
        activeCases: 1,
        lastContactAt: '2026-07-12T08:22:00Z'
    },
    {
        id: 'CL-003',
        legalName: 'Sierra Crest Transport Inc.',
        filingType: '1120',
        authorityStatus: 'validated',
        activeCases: 1,
        lastContactAt: '2026-07-12T11:16:00Z'
    },
    {
        id: 'CL-004',
        legalName: 'Glenford Medical Group',
        filingType: '1120S',
        authorityStatus: 'missing',
        activeCases: 1,
        lastContactAt: '2026-07-11T18:55:00Z'
    }
];

export function getSummary() {
    const openCases = cases.filter((item) => item.status !== 'transmitted').length;
    const criticalCases = cases.filter((item) => item.risk === 'critical').length;
    const acceptedTransmissions = transmissions.filter((item) => item.ackStatus === 'accepted').length;
    const rejectedTransmissions = transmissions.filter((item) => item.ackStatus === 'rejected').length;
    const unresolvedLedgerVariances = reconciliation.filter((item) => item.ledgerState === 'variance').length;

    return {
        openCases,
        criticalCases,
        acceptedTransmissions,
        rejectedTransmissions,
        unresolvedLedgerVariances,
        activeComplianceAlerts: complianceAlerts.filter((item) => item.status !== 'resolved').length,
        managedClients: clients.length
    };
}
