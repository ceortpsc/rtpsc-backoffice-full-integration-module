# 05 - A2A Engine (Application-to-Application)

## Overview

The A2A Engine enables direct machine-to-machine electronic return submission to the IRS Modernized e-File system using the SOAP-based A2A protocol, eliminating manual intermediary steps.

---

## A2A Protocol Stack

```text
PractitionerHub A2A Engine
  -> SOAP Envelope (XML)
  -> HTTPS/mTLS (PFX Certificate for EFIN 748335)
  -> IRS MeF A2A Gateway (la.www4.irs.gov/a2a/)
  -> IRS MeF Processing System
```

---

## Supported Submission Types

| Form | Description | Tax Year Support |
|---|---|---|
| 1040 | Individual Income Tax | Current + 2 prior |
| 1040-SR | Senior Individual | Current + 2 prior |
| 1040-NR | Nonresident Alien | Current + 2 prior |
| 1120 | C-Corporation | Current + 2 prior |
| 1120-S | S-Corporation | Current + 2 prior |
| 1065 | Partnership | Current + 2 prior |
| 990 | Exempt Organization | Current + 2 prior |
| 941 | Quarterly Payroll | Current year |
| 4868 | Extension of Time | Current year |
| 2350 | Extension (Abroad) | Current year |

---

## SOAP Envelope Structure

```xml
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:irs="http://www.irs.gov/a2a">
  <soapenv:Header>
    <irs:EFINHeader>
      <irs:EFIN>748335</irs:EFIN>
      <irs:SubmissionType>Individual</irs:SubmissionType>
      <irs:TaxYear>2025</irs:TaxYear>
    </irs:EFINHeader>
  </soapenv:Header>
  <soapenv:Body>
    <irs:SubmissionManifest>
      <irs:SubmissionId>[UUID]</irs:SubmissionId>
      <irs:ReturnType>1040</irs:ReturnType>
      <irs:TaxPeriodBeginDate>2025-01-01</irs:TaxPeriodBeginDate>
      <irs:TaxPeriodEndDate>2025-12-31</irs:TaxPeriodEndDate>
    </irs:SubmissionManifest>
    <!-- Return data attachment (Base64 encoded ZIP) -->
  </soapenv:Body>
</soapenv:Envelope>
```

### Acknowledgment Codes

| Code | Meaning | Next Action |
|---|---|---|
| A | Accepted | Notify client and archive |
| R | Rejected | Parse error codes, correct, resubmit |
| P | Pending | Poll again in 90 seconds |
| I | Incomplete | Add missing data and resubmit |
| D | Duplicate | Do not resubmit, investigate |

---

## Retry Configuration

```yaml
a2a_engine:
  endpoint: "https://la.www4.irs.gov/a2a/"
  efin: "748335"
  cert_path: "/certs/mef-a2a-748335.pfx"
  batch_size_max: 100
  retry_attempts: 3
  retry_backoff: [30, 60, 120]
  ack_poll_interval_seconds: 90
  ack_timeout_hours: 48
  soap_version: "1.1"
  compression: "ZIP"
  encryption: "AES-256"
```

### Submission Audit Log Fields

| Field | Type | Description |
|---|---|---|
| `submission_id` | UUID | Unique per submission |
| `efin` | String | 748335 |
| `form_type` | String | 1040, 1120, and others |
| `tax_year` | Integer | Example: 2025 |
| `tin_masked` | String | XXX-XX-1234 |
| `transmitted_at` | ISO 8601 | UTC timestamp |
| `ack_code` | Enum | A/R/P/I/D |
| `ack_received_at` | ISO 8601 | UTC timestamp |
| `preparer_id` | String | Internal preparer reference |
| `submission_file_hash` | SHA-256 | File integrity check |
