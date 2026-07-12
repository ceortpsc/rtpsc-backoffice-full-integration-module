# 09 - ERO Client Status Module

## Overview

The ERO Client Status module provides real-time visibility into each client's return status across preparation, transmission, and post-filing lifecycle for EFIN 748335.

---

## Client Status Lifecycle

```text
NEW_CLIENT
-> INTAKE_COMPLETE
-> DOCUMENTS_COLLECTED
-> RETURN_IN_PREPARATION
-> PEER_REVIEW
-> AWAITING_CLIENT_SIGNATURE
-> SIGNED_APPROVED
-> QUEUED_FOR_TRANSMISSION
-> TRANSMITTED
-> IRS_ACCEPTED -> REFUND_PROCESSING -> REFUND_ISSUED
-> IRS_REJECTED -> CORRECTION_REQUIRED -> RETURN_IN_PREPARATION
-> STATE_TRANSMITTED
-> STATE_ACCEPTED
-> CLOSED
```

---

## Status Definitions

| Status Code | Description | Responsible Party |
|---|---|---|
| `NEW_CLIENT` | Client record created | Staff |
| `INTAKE_COMPLETE` | Intake form completed | Client |
| `DOCUMENTS_COLLECTED` | Source docs uploaded | Client |
| `RETURN_IN_PREPARATION` | Return in progress | Preparer |
| `PEER_REVIEW` | Secondary review | Reviewer |
| `AWAITING_CLIENT_SIGNATURE` | Awaiting e-signature | Client |
| `SIGNED_APPROVED` | Form 8879 signed | Client |
| `QUEUED_FOR_TRANSMISSION` | Ready in queue | System |
| `TRANSMITTED` | Sent to IRS, awaiting ACK | System |
| `IRS_ACCEPTED` | Accepted by IRS | System |
| `IRS_REJECTED` | Rejected by IRS | Preparer |
| `CORRECTION_REQUIRED` | Amendment needed | Preparer |
| `REFUND_PROCESSING` | Refund processing by IRS | IRS |
| `REFUND_ISSUED` | Refund issued | IRS |
| `STATE_TRANSMITTED` | State return sent | System |
| `STATE_ACCEPTED` | State acceptance received | System |
| `CLOSED` | Filing lifecycle completed | Staff |

---

## ERO Status Dashboard Metrics

- Total Active Clients
- Returns in Preparation
- Awaiting Client Action
- Transmitted Today
- Accepted/Rejected Ratio
- Average Days to Acceptance
- Refunds Issued count and total amount
- Outstanding Corrections

## SLA Targets

| Stage | SLA | Alert if Exceeded |
|---|---|---|
| Documents to Preparation Start | 1 business day | Yes |
| Preparation to Peer Review | 2 business days | Yes |
| Peer Review to Client Approval | 1 business day | Yes |
| Client Signature Timeout | 72 hours | Yes, auto-escalate |
| Approved to Transmission | 4 hours | Yes |
| Transmission to IRS ACK | 48 hours | Yes |
| Rejection to Correction Start | 1 business day | Yes |

## ERO Compliance Indicators

| Indicator | Threshold | Action |
|---|---|---|
| Acceptance Rate | > 95% | Alert if below |
| Avg Prep Time | Monitor outliers | Flag if > 14 days |
| Client Signature Expiry | 72-hour timeout | Auto-reminder at 24/48 hours |
| Unsigned 8879s | Must be zero at transmission | Block transmission |
| Duplicate SSN Alert | Any | Immediate hold |
