# 12 - Refund Tracking and Intelligence Module

## Overview

The Refund Tracking and Intelligence module provides end-to-end visibility into the IRS refund pipeline for clients under EFIN 748335, combining WMR polling, TC code analysis, predictive timeline modeling, and anomaly detection.

---

## Refund Pipeline Stages

```text
[IRS Return Accepted (TC 150)]
  -> [WMR: Return Received]
  -> [WMR: Refund Approved, TC 846 date set]
  -> [WMR: Refund Sent]
     - Direct Deposit: 1-5 business days
     - Paper Check: 5-21 days
  -> [Refund Posted to Client Account]
  -> [Status: CLOSED]
```

## WMR Status Mapping

| WMR Status | TC Indicator | Typical Timeline | Action |
| --- | --- | --- | --- |
| Return Received | TC 150 posted | Day 0 | None |
| Refund Approved | TC 846 scheduled | Day 5-10 | Notify client |
| Refund Sent | TC 846 date reached | Day 10-21 | Confirm bank/mail |
| Need More Information | TC 971 and notice | Variable | Contact IRS |
| Take Action | TC 570 or 810 | Variable | Investigate |

## Standard Refund Timelines

| Filing Method | Direct Deposit | Paper Check |
| --- | --- | --- |
| e-File | 10-21 days | 4-6 weeks |
| Paper File | 4-6 weeks | 6-8 weeks |
| Amended (1040-X) | N/A | 8-20 weeks |
| Business Return | 3-6 weeks | 6-8 weeks |

PATH Act note: EIC and ACTC refunds are held until after Feb 15 each filing season.

---

## Refund Intelligence Features

### Anomaly Detection

| Anomaly | Detection Rule | Alert |
| --- | --- | --- |
| Refund delayed > 21 days | TC 150 + 21 days, no TC 846 | Critical |
| Refund frozen | TC 810 present | Critical immediate |
| Partial refund issued | TC 846 amount < expected | Warning |
| Refund redirected | TC 846 routing differs from client bank | Critical immediate |
| Duplicate refund request | Two TC 846 entries in same period | Fraud flag |
| Address change before refund | TC 014 before TC 846 | Fraud flag |

### Predictive Timeline Model

The model predicts:

- Expected TC 846 posting date
- Expected direct deposit date
- Probability of WMR status change within 48 hours
- Refund hold risk score (0-100)

```yaml
refund_intelligence:
  model: "practitionerhub-refund-v2"
  features:
    - filing_method
    - form_type
    - filing_date
    - agi_band
    - credits_claimed
    - prior_year_hold_flag
    - identity_verified
    - tc_history_pattern
  output:
    - predicted_tc846_date
    - predicted_deposit_date
    - hold_probability_score
    - confidence_interval
```

## Polling Configuration

```yaml
refund_tracking:
  poll_source: "irs_tunnel"
  poll_schedule: "0 */4 * * 1-5"
  path_act_hold_forms:
    - "EITC"
    - "8812"
  path_act_release_date: "Feb 15"
  anomaly_detection: true
  fraud_flag_routing: "audit_protection_engine"
  notification:
    on_status_change: [email, sms, in_app]
    on_refund_issued: [email, sms, in_app]
    on_anomaly: [email, in_app, alert_dashboard]
    on_hold: [email, in_app, preparer_alert]
```

### Refund Status Dashboard Metrics

- Total Refunds Pending
- Refunds Approved Today
- Refunds Issued Today
- Average Days to Refund
- Active Anomaly Flags
- PATH Act Holds
- Total Refund Dollar Volume

### Refund Risk Score Reference

| Score | Risk Level | Meaning | Recommended Action |
| --- | --- | --- | --- |
| 0-20 | Low | Standard processing expected | Monitor normally |
| 21-50 | Medium | Minor delay possible | Poll more frequently |
| 51-75 | Elevated | Hold/review likely | Proactively contact IRS |
| 76-100 | High | Freeze/fraud likely | Immediate preparer action |

### Integration Points

| Module | Integration |
| --- | --- |
| IRS Tunnel | WMR status pulls and TC retrieval |
| TC Sync Engine | Reads TC 570/571/810/811/846 |
| Trigger Engine | Fires on status change/anomaly |
| Audit Protection | Receives fraud flags |
| Client Masterfile | Updates refund status per filing |
| Notification System | Dispatches client and preparer alerts |
| TPP Reconciliation | Matches refund outcomes to bank products |
