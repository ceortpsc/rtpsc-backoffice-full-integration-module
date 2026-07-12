# 11 - TC Codes Real-Time Sync Module

## Overview

The TC Codes module provides real-time synchronization of IRS Transaction Codes from taxpayer account transcripts retrieved via the IRS Tunnel. TC codes describe account actions used for audit defense, refund tracking, and compliance operations.

---

## Critical TC Code Reference

### Return and Assessment Codes

| TC | Description | Significance |
|---|---|---|
| 150 | Return filed and tax assessed | Return posted to IRS master file |
| 154 | Filing requirement change | IRS changed filing requirement |
| 160 | Penalty for failure to file | FTF penalty assessed |
| 161 | Abatement of FTF penalty | Penalty removed |
| 170 | Estimated tax penalty | Underpayment penalty assessed |
| 171 | Abatement of estimated tax penalty | Penalty removed |

### Refund Codes

| TC | Description | Significance |
|---|---|---|
| 570 | Additional account action pending | Refund held, investigate |
| 571 | Resolved hold released | Prior 570 resolved |
| 572 | Resolved with additional action | Hold resolved with action |
| 846 | Refund issued | Refund disbursed |
| 766 | Credit to account | Tax credit applied |
| 768 | Earned Income Credit | EIC posted |
| 971 | Notice issued | IRS correspondence generated |

### Audit and Examination Codes

| TC | Description | Significance |
|---|---|---|
| 420 | Examination indicator | Return under examination |
| 421 | Examination closed | Audit closed |
| 424 | Examination request | Examination initiated |
| 922 | Review of unreported income | Additional IRS review |
| 810 | Refund freeze | Identity/fraud hold |
| 811 | Refund freeze removed | Freeze lifted |

### Payment and Collection Codes

| TC | Description | Significance |
|---|---|---|
| 610 | Remittance with return | Payment posted with return |
| 670 | Additional tax payment | Subsequent payment posted |
| 680 | Deposit interest earned | Interest on deposit |
| 582 | Federal tax lien filed | Urgent collection indicator |
| 583 | Lien released | Lien removed |
| 480 | Offer in Compromise pending | OIC submitted |
| 481 | OIC accepted | Offer accepted |
| 482 | OIC rejected | Offer rejected |

---

## TC Sync Architecture

```text
[IRS Tunnel Transcript Request]
  -> [TC Parser: Extract TC/date/amount]
  -> [TC Classifier: Refund/Audit/Payment/Penalty]
  -> [Masterfile Update]
  -> [Trigger Evaluation]
  -> [Alert Dispatch]
  -> [Dashboard Refresh]
```

## TC Sync Configuration

```yaml
tc_sync:
  pull_source: "irs_tunnel"
  transcript_type: "TXAC"
  sync_schedule: "0 6 * * 1-5"
  alert_tcs:
    - "570"
    - "810"
    - "420"
    - "582"
    - "971"
  dashboard_refresh_seconds: 300
  history_retention_years: 7
```

### TC Alert Priority Matrix

| TC | Alert Level | Notification | Response Time |
|---|---|---|---|
| 570 | Warning | In-app + Email | 24 hours |
| 810 | Critical | In-app + Email + SMS | 4 hours |
| 420 | Critical | In-app + Email | 4 hours |
| 582 | Urgent | All channels | Immediate |
| 846 | Info | In-app + Email | None |
| 971 | Warning | In-app + Email | 24 hours |
| 150 | Info | In-app | None |
