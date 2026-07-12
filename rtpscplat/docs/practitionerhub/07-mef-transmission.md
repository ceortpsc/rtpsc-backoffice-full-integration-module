# 07 - MeF Transmission Module

## Overview

The MeF (Modernized e-File) module is the primary engine for federal tax return transmission. It handles schema validation, digital signature, package assembly, submission, and acknowledgment processing.

---

## MeF System Components

| Component | Function |
|---|---|
| Schema Validator | Validates XML return against IRS MeF schema |
| Return Packager | Assembles submission ZIP (return XML + attachments) |
| Digital Signer | Applies ERO PIN and EFIN signature |
| Submission Router | Routes to A2A engine |
| Acknowledgment Processor | Parses IRS ACK and updates status |
| Error Parser | Maps IRS error codes to fix instructions |

---

## MeF Schema Versions

| Tax Year | Schema Version | Status |
|---|---|---|
| 2025 | MeF 2025v1.0 | Current |
| 2024 | MeF 2024v5.0 | Supported |
| 2023 | MeF 2023v4.0 | Supported |
| 2022 | MeF 2022v3.0 | Legacy Support |
| 2021 | MeF 2021v2.0 | Expired |

---

## Return Package Structure

```text
submission_{UUID}.zip
|- manifest.xml
|- return.xml
|- attachments/
|  |- w2_001.xml
|  |- 1099_001.xml
|  \- supporting_docs/
\- signature.xml
```

### Signature Block

```xml
<ero:Signature xmlns:ero="http://www.irs.gov/ero">
  <ero:EFIN>748335</ero:EFIN>
  <ero:ERO_PIN>[5-digit self-select PIN]</ero:ERO_PIN>
  <ero:SignatureDate>2026-04-15</ero:SignatureDate>
  <ero:IPAddress>[Preparer workstation IP]</ero:IPAddress>
  <ero:SoftwareID>[PractitionerHub MeF ID]</ero:SoftwareID>
</ero:Signature>
```

---

## Business Rules Validation

| Rule Category | Examples |
|---|---|
| Filing Status | MFS not allowed if state requires MFJ |
| Dependent Validation | SSN must not be duplicate across returns |
| Income Thresholds | EIC phase-out limits enforced |
| Form Attachment | Schedule required when line exceeds threshold |
| Date Validation | Tax year must match period begin/end dates |
| Payment Routing | Routing number must pass check-digit validation |

### MeF API Endpoints (Production)

| Operation | Endpoint |
|---|---|
| Submit Return | POST <https://la.www4.irs.gov/a2a/> |
| Get Acknowledgment | GET <https://la.www4.irs.gov/a2a/ack/{submissionId}> |
| Validate Schema | Internal offline schema check |

### Performance Benchmarks

| Metric | Target | Current |
|---|---|---|
| Schema validation time | < 500ms | ~320ms |
| Package assembly time | < 2s | ~1.1s |
| Submission to ACK (Accepted) | < 24hr | ~4-6hr avg |
| Submission to ACK (Rejected) | < 2hr | ~45min avg |
| Batch throughput | 100 returns/batch | Meets target |
