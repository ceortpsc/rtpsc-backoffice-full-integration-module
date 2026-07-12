# 10 - Client Masterfile Module

## Overview

The Client Masterfile is the authoritative repository for all client records associated with EFIN 748335. It is the single source of truth for taxpayer identity, filing history, document storage, and account relationships.

---

## Masterfile Data Model

### Client Core Record

| Field | Type | Description |
| --- | --- | --- |
| `client_id` | UUID | Internal unique identifier |
| `efin` | String | 748335 |
| `tin` | Encrypted | SSN or ITIN (AES-256) |
| `tin_type` | Enum | SSN / ITIN / EIN |
| `first_name` | String | Legal first name |
| `last_name` | String | Legal last name |
| `dob` | Date | Date of birth |
| `filing_status` | Enum | Single/MFJ/MFS/HH/QW |
| `address_line1` | String | Street address |
| `address_line2` | String | Apt/Unit |
| `city` | String | City |
| `state` | String | 2-letter code |
| `zip` | String | ZIP+4 |
| `phone_primary` | String | Masked in logs |
| `email` | String | Client portal access |
| `identity_verified` | Boolean | Identity verification status |
| `identity_verified_at` | ISO 8601 | Verification timestamp |
| `ip_pin_enrolled` | Boolean | IRS IP PIN on file |
| `created_at` | ISO 8601 | Record creation time |
| `updated_at` | ISO 8601 | Last modification time |
| `status` | Enum | active/inactive/archived |

### Filing History Record

| Field | Type | Description |
| --- | --- | --- |
| `filing_id` | UUID | Unique filing ID |
| `client_id` | UUID | Client reference |
| `tax_year` | Integer | Example: 2025 |
| `form_type` | String | 1040, 1120, and others |
| `filing_status` | String | Filing status from return |
| `agi` | Decimal | Adjusted gross income |
| `total_tax` | Decimal | Total tax liability |
| `refund_amount` | Decimal | Refund or balance due |
| `submission_id` | UUID | MeF submission reference |
| `irs_ack_code` | Enum | A/R/P |
| `accepted_at` | ISO 8601 | IRS acceptance timestamp |
| `preparer_id` | UUID | Preparer reference |
| `archived_at` | ISO 8601 | Archive timestamp |

### Document Vault

| Document Type | Retention Policy | Encryption |
| --- | --- | --- |
| W-2 and 1099 source docs | 7 years | AES-256 |
| Signed Form 8879 | 7 years | AES-256 |
| Return copy (PDF) | 7 years | AES-256 |
| ID verification docs | 7 days (auto-purge) | AES-256 |
| IRS correspondence | 7 years | AES-256 |
| Audit defense package | Duration of statute | AES-256 |

---

## Masterfile Access Controls

| Operation | Roles Permitted |
| --- | --- |
| View Core Record | Owner, Senior Preparer, Preparer, Reviewer |
| Edit Core Record | Owner, Senior Preparer |
| View Filing History | All authenticated roles |
| View Documents | Owner, Senior Preparer, Preparer |
| Delete Client Record | Owner only |
| Export Client Data | Owner only, audit log required |
| Merge Duplicate Records | Owner only |

---

## Search and Filtering

Masterfile supports search by:

- TIN (last 4 digits only for non-owner roles)
- Last name and DOB
- Client ID
- Filing year
- Return status
- Preparer assignment
- Date ranges for created, updated, and filed timestamps

## Data Integrity Rules

```yaml
masterfile_integrity:
  tin_uniqueness: true
  required_fields:
    - tin
    - first_name
    - last_name
    - dob
    - filing_status
  ssn_format_validation: true
  itin_format_validation: true
  dob_future_date_check: true
  address_usps_validation: true
  change_audit_log: true
  soft_delete_only: true
```
