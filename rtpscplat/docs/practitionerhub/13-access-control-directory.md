# 13 - Access Control Directory

## Overview

This directory defines role-based access and integration access policy for PractitionerHub under EFIN 748335.

---

## Directory Artifacts

| Path | Purpose |
| --- | --- |
| `platform/security/access/rbac-integration-access-directory.yaml` | Canonical role and integration access policy for operations and audit reference |
| `platform/db/migrations/006_role_and_integration_access_directory.sql` | Database-level role, permission, and integration access seeding |

---

## Roles and Permission Model

| Role Code | Role Name | Access Intent |
| --- | --- | --- |
| ERO_ADMIN | ERO Administrator | Full operational and integration control |
| PREPARER | Tax Preparer | Return prep and transmission workflows with constrained admin access |
| AUDITOR | Compliance Auditor | Read-focused compliance and control-plane visibility |
| CLIENT | Client Portal User | Portal and refund visibility with own-data boundary |

### Key Permission Families

| Family | Permission Codes |
| --- | --- |
| Core Workflow | VIEW_RETURNS, EDIT_RETURNS, RUN_EFILE |
| Platform Access | ACCESS_GATEWAY, ACCESS_AUDIT_LOGS |
| IRS and Transmission | ACCESS_IRS_TUNNEL, ACCESS_MEF_A2A, ACCESS_FIRE_TRANSMISSION, ACCESS_MEF_TRANSMISSION |
| Tax Operations | ACCESS_IDENTITY_VERIFICATION, ACCESS_TPP_RECONCILIATION, ACCESS_ERO_STATUS, ACCESS_MASTERFILE, ACCESS_TC_SYNC, ACCESS_REFUND_INTELLIGENCE |
| Integration Governance | MANAGE_INTEGRATIONS |

---

## Integration Access Matrix

| Integration Code | ERO_ADMIN | PREPARER | AUDITOR | CLIENT |
| --- | --- | --- | --- | --- |
| GATEWAY | full | write | read | none |
| IRS_TUNNEL | full | none | read | none |
| MEF_A2A | full | write | none | none |
| FIRE_TRANSMISSION | full | write | none | none |
| MEF_TRANSMISSION | full | write | none | none |
| IDENTITY_VERIFY | full | write | none | none |
| TPP_RECON | full | none | read | none |
| ERO_STATUS | full | write | read | none |
| MASTERFILE | full | write | read | none |
| TC_SYNC | full | read | read | none |
| REFUND_INTELLIGENCE | full | read | read | own_only |

---

## Implementation Notes

- Permission checks run through `platform/auth/service.js` using `checkPermission` and `validateCredentialAccess`.
- Migration `006_role_and_integration_access_directory.sql` is additive and uses `INSERT OR IGNORE` for idempotent execution.
- The access directory YAML is intended as the operational source of truth for audits, release checks, and policy review.

## Release Gate Checks

1. Confirm migration 006 executes successfully in the target environment.
2. Verify role-to-permission mappings for all active operator accounts.
3. Validate integration access assignments for production roles.
4. Confirm no module requires a permission code absent from the directory artifacts.
