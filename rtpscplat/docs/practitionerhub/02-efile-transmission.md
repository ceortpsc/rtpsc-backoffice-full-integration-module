# 02 - eFile Transmission Module

## Overview

The eFile Transmission module is the unified orchestration layer that manages the full lifecycle of electronic return submission from initial staging through IRS acknowledgment and client notification.

---

## Transmission Lifecycle

```text
[Preparer Stages Return]
  -> [Validation Engine: Schema + Business Rules]
  -> [ERO Signature Applied (PIN)]
  -> [Encryption + EFIN Header Injection]
  -> [Routed to Correct Channel]
     - Individual/Business -> MeF A2A
     - Information Returns -> FIRE
     - State Returns -> State Gateway
  -> [IRS Acknowledgment Received]
  -> [Client and Staff Notification]
  -> [Acknowledgment Stored in Masterfile]
```

---

## Validation Rules

### Pre-Transmission Checks

| Check | Rule | On Failure |
|---|---|---|
| SSN/ITIN Format | 9 digits, no dashes | Block |
| EIN Format | XX-XXXXXXX | Block |
| EFIN Present | Must match 748335 | Block |
| ERO PIN | 5-digit self-select | Block |
| Duplicate Detection | Check prior submissions | Warn |
| Balance Due | IRS payment routing valid | Warn |
| Schema Version | Must match current MeF schema | Block |
| State Attachment | Required if state return present | Warn |

---

## Transmission Status Codes

| Code | Description | Action Required |
|---|---|---|
| `STAGED` | Return queued, not yet sent | None |
| `TRANSMITTING` | In transit to IRS | Monitor |
| `ACCEPTED` | IRS accepted return | Notify client |
| `REJECTED` | IRS rejected with error codes | Correct and resubmit |
| `PENDING` | IRS processing, no ack yet | Wait up to 48 hours |
| `DUPLICATE` | Previously accepted return | Investigate |
| `HOLD` | ERO hold applied | Release or discard |

---

## Rejection Handling Workflow

```text
[Rejection Received from IRS]
  -> [Parse Rejection Code(s)]
  -> [Map to Internal Error Description]
  -> [Route to Preparer Queue with Fix Instructions]
  -> [Preparer Corrects Return]
  -> [Re-Validate]
  -> [Resubmit: Max 3 attempts before escalation]
```

### Common Rejection Codes

| IRS Code | Description | Common Fix |
|---|---|---|
| R0000-504 | Duplicate SSN on return | Verify SSN, check prior filing |
| R0000-902 | EFIN not active | Verify IRS e-Services |
| IND-031 | Prior year AGI mismatch | Correct AGI from prior return |
| IND-032 | Prior year AGI mismatch (spouse) | Correct spouse AGI |
| F1040-072 | Invalid IP PIN | Obtain correct IP PIN from client |
| R0000-507 | SSN locked by identity theft | Client must contact IRS |
| DCN-DuplicateW2 | Duplicate W-2 submitted | Consolidate or remove duplicate |

---

## Configuration

```yaml
efile_transmission:
  efin: "748335"
  ero_pin_required: true
  max_batch_size: 100
  retry_attempts: 3
  retry_backoff_seconds: [30, 60, 120]
  duplicate_window_days: 365
  acknowledgment_poll_interval_seconds: 90
  channels:
    federal: mef_a2a
    information_returns: fire
    state: state_gateway
  notifications:
    on_accept: [email, sms, in_app]
    on_reject: [email, in_app]
    on_pending_48h: [in_app, alert]
```

### Audit Trail Fields

Every transmission event logs:

- `transmission_id` (UUID)
- `efin` (748335)
- `timestamp_utc`
- `return_type` (1040, 1120, 1065, and others)
- `taxpayer_tin_masked` (XXX-XX-1234)
- `channel` (`mef_a2a` | `fire` | `state`)
- `status`
- `ack_code`
- `preparer_id`
- `ip_address`
