# 01 - Tax Practitioner Independent Contractor Hub

## Overview and Module Registry

### Purpose

PractitionerHub is the central operating platform for tax practitioners working as independent contractors. It unifies IRS transmission channels, client lifecycle management, financial reconciliation, identity verification, and real-time IRS data sync into a single authenticated environment scoped to EFIN 748335.

---

### Platform Architecture

```text
+---------------------------------------------------------+
|                 PractitionerHub Platform                |
+-------------------+-------------------+-----------------+
| IRS Layer         | Client Layer      | Finance Layer   |
| - MeF             | - Masterfile      | - TPP Recon     |
| - A2A             | - ERO Status      | - Ledger        |
| - FIRE            | - TC Sync         | - Refund Intel  |
| - Tunnel          | - Identity        | - Gateway       |
+-------------------+-------------------+-----------------+
```

---

### Module Registry

| # | Module | Status | Engine Key |
| --- | --- | --- | --- |
| 01 | eFile Transmission | Active | `ENABLE_EFILE` |
| 02 | Gateway | Active | `ENABLE_GATEWAY` |
| 03 | IRS Communication Tunnels | Active | `ENABLE_IRS_TUNNEL` |
| 04 | A2A Engine | Active | `ENABLE_MEF_A2A` |
| 05 | FIRE Engine | Active | `ENABLE_FIRE_TRANSMISSION` |
| 06 | MeF Transmission | Active | `ENABLE_MEF` |
| 07 | Identity Verification / TPP | Active | `ENABLE_IDENTITY_VERIFY` |
| 08 | ERO Client Status | Active | `ENABLE_ERO_STATUS` |
| 09 | Client Masterfile | Active | `ENABLE_MASTERFILE` |
| 10 | TC Codes Real-Time Sync | Active | `ENABLE_TC_SYNC` |
| 11 | Refund Tracking and Intelligence | Active | `ENABLE_REFUND_INTELLIGENCE` |

---

### Roles and Permissions Matrix

| Role | Transmission | Client Data | TC Codes | Refund Intel | Admin |
| --- | --- | --- | --- | --- | --- |
| Owner (EFIN Holder) | Full | Full | Full | Full | Full |
| Senior Preparer | Submit | Read/Write | Read | Read | No |
| Preparer | Stage Only | Read/Write | Read | Read | No |
| Reviewer | No | Read | Read | Read | No |
| Client Portal | No | Own Only | No | Own Only | No |

---

### Environment Configuration

```env
APP_PROFILE=production
EFIN=748335
NODE_ENV=production

ENABLE_EFILE=true
ENABLE_GATEWAY=true
ENABLE_IRS_TUNNEL=true
ENABLE_MEF_A2A=true
ENABLE_FIRE_TRANSMISSION=true
ENABLE_MEF=true
ENABLE_IDENTITY_VERIFY=true
ENABLE_TPP_RECONCILIATION=true
ENABLE_ERO_STATUS=true
ENABLE_MASTERFILE=true
ENABLE_TC_SYNC=true
ENABLE_REFUND_INTELLIGENCE=true
ENABLE_AUDIT_PROTECTION=true
ENABLE_WORKFLOW_ENGINE=true
ENABLE_TRIGGER_ENGINE=true
ENABLE_BACKGROUND_WORKERS=true
```

### Support and Escalation

| Tier | Contact | Scope |
| --- | --- | --- |
| Platform Owner | Condre Dvon Ross | All modules |
| IRS e-Help Desk | 1-866-255-0654 | MeF, FIRE, A2A |
| IRS FIRE Support | 1-866-455-7438 | FIRE only |
| IRS TDS Hotline | 1-800-908-9946 | Transcripts, TC codes |
