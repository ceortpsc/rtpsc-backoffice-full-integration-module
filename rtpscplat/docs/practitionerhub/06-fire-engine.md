# 06 - FIRE Engine (Filing Information Returns Electronically)

## Overview

The FIRE Engine manages electronic transmission of information returns (1099-series, W-2G, and 5498-series) to the IRS FIRE system via SFTP, aligned to IRS Publication 1220 specifications.

---

## Supported Information Returns

| Form | Description | Deadline |
|---|---|---|
| 1099-NEC | Nonemployee Compensation | Jan 31 |
| 1099-MISC | Miscellaneous Income | Feb 28 / Mar 31 (e-file) |
| 1099-INT | Interest Income | Feb 28 / Mar 31 (e-file) |
| 1099-DIV | Dividends | Feb 28 / Mar 31 (e-file) |
| 1099-R | Retirement Distributions | Feb 28 / Mar 31 (e-file) |
| 1099-K | Payment Card Transactions | Feb 28 / Mar 31 (e-file) |
| 1099-G | Government Payments | Feb 28 / Mar 31 (e-file) |
| 1099-S | Real Estate Proceeds | Feb 28 / Mar 31 (e-file) |
| W-2G | Gambling Winnings | Feb 28 / Mar 31 (e-file) |
| 5498 | IRA Contribution Info | May 31 |
| 5498-SA | HSA Contribution Info | May 31 |

Note: 10 or more information returns require mandatory e-filing (effective tax year 2024).

---

## FIRE SFTP Connection

```yaml
fire_sftp:
  host: "fire.irs.gov"
  port: 22
  username: "[TCC-linked FIRE account for EFIN 748335]"
  auth_method: "password"
  remote_upload_path: "/upload"
  remote_status_path: "/status"
  connection_timeout_seconds: 30
  tcc: "[Your Transmitter Control Code]"
```

## File Structure per Publication 1220

```text
T Record    - Transmitter Record (1 per file)
A Record    - Payer Record (1 per payer)
B Records   - Payee Records (1 per payee)
C Record    - End of Payer Record
F Record    - End of Transmitter Record
```

---

## Transmission Process

```text
[Generate Information Return Data]
  -> [Format per Publication 1220]
  -> [File Name: {TCC}{Year}{Sequence}.txt]
  -> [Duplicate Detection Check]
  -> [SFTP Upload to /upload]
  -> [Poll /status for FIRE status file]
  -> [Parse status: Good/Bad/Mixed]
  -> [Correct and resubmit bad records]
```

### FIRE Status Codes

| Status | Meaning | Action |
|---|---|---|
| Good | All records accepted | Archive file |
| Bad | All records rejected | Correct entire file and resubmit |
| Mixed | Partial acceptance | Submit replacement file for bad records |
| Not yet processed | FIRE queue | Poll again in 2 hours |

### Seasonal Throttle Policy

| Period | Max Files/Hour | Reason |
|---|---|---|
| Jan 1 - Mar 31 | 5 | IRS peak season |
| Apr 1 - Dec 31 | 20 | Standard |

---

## Configuration

```yaml
fire_engine:
  tcc: "[Transmitter Control Code]"
  efin: "748335"
  test_mode: false
  duplicate_detection: true
  file_name_pattern: "{TCC}{year}{seq:04d}.txt"
  seasonal_throttle:
    jan_mar: 5
    apr_dec: 20
  status_poll_interval_minutes: 120
  archive_path: "/archives/fire/{year}/"
```
