# 08 - Identity Verification and TPP Module

## Overview

This module handles two integrated functions:

1. Identity Verification for taxpayer intake and pre-transmission checks.
2. TPP (Third-Party Payer) reconciliation for fee and disbursement consistency.

---

## Part A: Identity Verification

### Verification Flow

```text
[Client Intake]
  -> [Document Scan: Government ID]
  -> [SSN/ITIN Format Validation]
  -> [IRS Cross-Reference via Tunnel]
  -> [Biometric Liveness (optional)]
  -> [IP PIN Verification (if applicable)]
  -> [Identity Score Computed]
  -> PASS: Proceed to preparation
  -> FAIL x3: Manual review queue
```

### Verification Layers

| Layer | Method | Required |
|---|---|---|
| Document Scan | Government-issued photo ID | Yes |
| SSN/ITIN Validation | Format + IRS TDS lookup | Yes |
| Date of Birth Match | Compare ID and intake data | Yes |
| Address Verification | USPS + prior return match | Recommended |
| Biometric Liveness | Facial match to ID photo | Optional |
| IP PIN Verification | IRS-issued 6-digit IP PIN | Conditional |
| Knowledge-Based Auth | Credit bureau questions | Fallback only |

### Identity Scores

| Score Range | Status | Action |
|---|---|---|
| 90-100 | Verified | Proceed |
| 70-89 | Conditional | Additional verification step |
| 50-69 | Uncertain | Manual review |
| 0-49 | Failed | Escalate, do not transmit |

### PII Security Requirements

```yaml
pii_security:
  encryption_at_rest: "AES-256"
  encryption_in_transit: "TLS 1.3"
  ssn_log_masking: true
  itin_log_masking: true
  dob_log_masking: true
  document_image_retention_days: 7
  verification_result_ttl_days: 90
  compliance_reference: "IRS Publication 4557"
```

---

## Part B: TPP Reconciliation

### Reconciliation Flow

```text
[Daily 02:00 CT Job]
  -> [Pull expected disbursements from ledger]
  -> [Fetch actual disbursements from TPP API]
  -> [Match by TIN + Product ID + Tax Year]
  -> [Compute variance = expected - received]
  -> [Auto-approve <= $0.01]
  -> [Review $0.01-$1.00]
  -> [Dispute > $1.00]
  -> [Generate report and post to ledger]
```

### Bank Product Types

| Product Code | Description |
|---|---|
| RT | Refund Transfer |
| EA | Easy Advance |
| RA | Refund Advance |
| EFC | ERO Fee Collect |
| PC | Prepaid Card |

### Reconciliation Report Fields

- `batch_id`
- `client_tin_masked`
- `product_code`
- `tax_year`
- `expected_amount`
- `received_amount`
- `variance`
- `variance_status` (approved/review/disputed)
- `reconciled_at`
- `dispute_ref`

### TPP Configuration

```yaml
tpp_reconciliation:
  efin: "748335"
  run_schedule: "0 2 * * *"
  variance_auto_approve: 0.01
  variance_review: 1.00
  partner_api_endpoint: "[Production TPP endpoint]"
  partner_api_key: "[From secrets vault]"
  dispute_escalation_engine: "workflow"
  audit_log_enabled: true
  dry_run: false
```
