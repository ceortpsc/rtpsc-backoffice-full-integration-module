# 17 - Notice Family Mapping Appendix (Companion to Section 16)

## 1. Appendix Control

- Document ID: RTP-IRS-RESP-APPX-001
- Parent Document: 16 - IRS Form and Letter Response Platform Blueprint
- Version: 1.0.0
- Effective Date: 2026-07-12
- Classification: Internal Restricted - Compliance Controlled

---

## 2. Purpose and Usage

This appendix provides expanded, operations-ready mapping tables for IRS notice families, letter families, and form families. These tables are intended for direct use by:

1. Intake classification pipelines.
2. ERO and reviewer playbooks.
3. Rule engine routing and SLA enforcement.
4. Audit and compliance traceability checks.

All entries are placeholders for legal and procedural references and must be finalized by governance review before production policy lock. [Citation: IRM 1.x.x.x] [Citation: IRM 21.x.x.x]

---

## 3. CP Notice Family Mapping

Table A1: CP notice mapping (insert figure/table rendering in PDF)

| Family | Example Notice | Typical Trigger | Required Inputs | Primary Response Package | Deadline Class | Risk Tier | Escalation Path | Authority Placeholders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CP2000 | CP2000 Underreporter | Third-party mismatch | Notice, return copy, income substantiation | Reconciliation worksheet + explanation letter + exhibits | Statutory correspondence window | High | Reviewer -> Compliance Officer | [Citation: IRM 4.x.x.x], [Citation: IRC sec. 6212] |
| CP14 | CP14 Balance Due | Tax due unpaid | Notice, account transcript, payment history | Balance validation + payment recommendation memo | Immediate taxpayer action window | Medium | Preparer -> Reviewer | [Citation: IRM 21.x.x.x], [Citation: IRC sec. 6601] |
| CP501 | CP501 Reminder | Unpaid balance progression | Notice chain, prior correspondence | Reminder response + payment/abatement branch decision | Near-term collection window | Medium | Reviewer | [Citation: IRM 5.x.x.x] |
| CP503 | CP503 Urgent Reminder | Continued unpaid balance | Notice, account history, hardship indicators | Collection mitigation proposal | Accelerated collection window | High | Reviewer -> Compliance Officer | [Citation: IRM 5.x.x.x], [Citation: IRC sec. 6159] |
| CP504 | CP504 Intent to Levy Notice | Escalated collection activity | Notice, liability summary, financial profile | Levy risk response + installment/appeal path packet | Critical collection window | Critical | Compliance Officer -> Counsel | [Citation: IRM 5.x.x.x], [Citation: IRC sec. 6331] |
| CP05 | CP05 Refund Review | Refund hold/review | Notice, return, identity and substantiation docs | Refund hold support packet | Variable review timeline | Medium | Preparer -> Reviewer | [Citation: IRM 21.x.x.x] |
| CP75 | CP75 EITC Verification | Credit substantiation request | Notice, eligibility records, dependent proofs | EITC substantiation package | Time-bound substantiation window | High | Reviewer -> Compliance Officer | [Citation: IRM 4.x.x.x], [Citation: IRC sec. 32] |
| CP90 | CP90 Final Notice of Intent to Levy | Collections escalation | Notice, prior notices, hardship records | CDP/appeal readiness packet | Statutory appeal window | Critical | Compliance Officer -> Counsel | [Citation: IRM 5.x.x.x], [Citation: IRC sec. 6330] |

---

## 4. LTR Letter Family Mapping

Table A2: LTR notice mapping

| Family | Example Letter | Typical Trigger | Required Inputs | Primary Response Package | Deadline Class | Risk Tier | Escalation Path | Authority Placeholders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LTR3219C | Statutory Notice (Deficiency) | Proposed deficiency determination | Letter, return workpapers, substantiation exhibits | Petition-readiness and deficiency challenge packet | Statutory petition window | Critical | Senior Reviewer -> Counsel | [Citation: IRC sec. 6213], [Citation: IRM 4.x.x.x] |
| LTR12C | Return Information Request | Missing return data | Letter, missing forms/schedules, identity docs | Deficiency cure packet | Response window set in letter | High | Preparer -> Reviewer | [Citation: IRM 21.x.x.x] |
| LTR2645C | Interim Delay Letter | Case delay/processing lag | Letter, prior submission evidence | Status-confirmation and follow-up request | Follow-up schedule window | Low | Intake -> Queue Monitor | [Citation: IRM 21.x.x.x] |
| LTR105C | Claim Disallowance | Refund claim denied | Disallowance letter, claim file, legal basis memo | Protest/appeal-ready packet | Appeal period window | High | Reviewer -> Compliance Officer | [Citation: IRC sec. 6532], [Citation: IRM 25.x.x.x] |
| LTR4800C | Return Processing Inquiry | Processing hold/question | Letter, return data, mismatch evidence | Clarification packet and corrections | Administrative response window | Medium | Preparer -> Reviewer | [Citation: IRM 21.x.x.x] |
| LTR4464C | Return Review/Verification | Return selected for review | Letter, income and withholding proofs | Verification packet | Administrative review window | Medium | Reviewer | [Citation: IRM 4.x.x.x] |
| LTR525 | Examination Contact | Audit initiation | Letter, books and records, representation docs | Exam response binder + timeline plan | Scheduled examination timeline | High | Reviewer -> Compliance Officer | [Citation: IRM 4.x.x.x] |

---

## 5. Form-by-Form Mapping (Core Federal)

Table A3: Form family mapping

| Form | Taxpayer Type | Common Response Context | Required Inputs | Primary Output Artifact | SLA Class | Risk Tier | Rule Modules | Authority Placeholders |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Form 1040 | Individual | Individual return discrepancy or amendment | Return, schedules, W-2/1099, substantiation records | Response narrative + exhibits + amended schedules if needed | Standard | Medium | Deadline, penalty, substantiation | [Citation: IRC sec. 6012], [Citation: IRM 21.x.x.x] |
| Form 1040-X | Individual | Return amendment | Original return, corrected figures, explanation statement | Amended return packet | Standard | Medium | Amendment validation | [Citation: IRM 21.x.x.x] |
| Form 1065 | Partnership | Partnership informational filing issues | Return, K-1s, books and records | Partnership response binder | Elevated | High | Entity consistency rules | [Citation: IRC sec. 6031] |
| Form 1120 | C Corporation | Corporate filing variance | Return, statements, ledger extracts, supporting tax positions | Corporate variance response packet | Elevated | High | Corporate penalty/interest rules | [Citation: IRC sec. 11], [Citation: IRM 4.x.x.x] |
| Form 1120-S | S Corporation | S-corp processing or compliance issue | Return, K-1s, shareholder records | S-corp compliance package | Elevated | High | Pass-through integrity rules | [Citation: IRC sec. 1361], [Citation: IRM 4.x.x.x] |
| Form 941 | Employer | Employment tax inquiry | Payroll records, deposits, filings history | Employment tax response packet | Accelerated | High | Deposit penalty logic | [Citation: IRC sec. 6656], [Citation: IRM 4.x.x.x] |
| Form 940 | Employer | FUTA-related notice | Wage and unemployment tax records | FUTA response packet | Standard | Medium | Employer tax checks | [Citation: IRC sec. 3301] |
| Form 1041 | Estate/Trust | Fiduciary return mismatch | Return, trust docs, beneficiary schedules | Fiduciary response package | Elevated | High | Fiduciary validation | [Citation: IRC sec. 641] |
| Form 433-A | Individual collection | Installment or collection analysis | Financial statement, income/expense proof, assets/liabilities | Financial resolution packet | Critical in collections contexts | High | Collection feasibility rules | [Citation: IRM 5.x.x.x], [Citation: IRC sec. 6159] |
| Form 433-B | Business collection | Business collection resolution | Business financial statements, payroll, liabilities | Business collection package | Critical in collections contexts | High | Business solvency and payment plan rules | [Citation: IRM 5.x.x.x] |
| Form 2848 | Authorization | Representative authorization | Executed POA, taxpayer identity evidence | Representation authorization record | Immediate enablement | Medium | Authorization validation | [Citation: IRC sec. 6103], [Citation: IRM 21.x.x.x] |
| Form 8821 | Tax information authorization | Transcript/account information access | Executed form, identity proof | Info authorization record | Immediate enablement | Low | Access scope validation | [Citation: IRC sec. 6103] |

---

## 6. Crosswalk: Notice to Workflow and AI Gate Requirements

Table A4: Workflow and human-in-the-loop crosswalk

| Identifier Family | Default Workflow Path | Mandatory Human Gate | AI Constraint Level | Submission Authority |
| --- | --- | --- | --- | --- |
| CP2000 / discrepancy notices | Intake -> Triage -> Analysis -> Draft -> Review -> Submit | Gate A + Gate D | High | ERO or authorized signer |
| Deficiency letters (LTR3219C-type) | Intake -> Triage -> Counsel Review -> Draft -> Senior Review -> Submit | Gate A + Gate C + Gate D | Critical | Authorized signer with counsel concurrence |
| Collections escalation notices (CP504/CP90) | Intake -> Triage -> Compliance Review -> Resolution Draft -> Submit | Gate B + Gate D | Critical | Compliance-approved signer |
| Information request letters (LTR12C family) | Intake -> Evidence Collection -> Draft -> Review -> Submit | Gate D | Medium | Reviewer-approved preparer flow |
| Standard return processing notices | Intake -> Triage -> Draft -> Review -> Submit | Gate D | Medium | ERO delegated authority |

---

## 7. Data Dictionary for Mapping Tables

| Field | Definition | Validation Rule |
| --- | --- | --- |
| Deadline Class | Policy bucket for urgency and legal time windows | Must map to policy catalog value |
| Risk Tier | Operational risk assignment | Enum: low, medium, high, critical |
| Escalation Path | Ordered role route for exceptions | Must terminate at accountable approver |
| Rule Modules | Engine modules required for case family | Must reference compiled policy bundle IDs |
| Authority Placeholders | Legal/procedural citations | At least one IRM or IRC citation required |

---

## 8. Implementation Notes

1. Bind Table A1-A4 rows to canonical registry IDs used in Section 16.
2. Attach each row to at least one template bundle and one checklist bundle.
3. Add automated coverage tests to ensure every high-risk family has mandatory human gates.
4. Use policy migration workflow to version-control mapping changes.

---

## 9. Placeholder References

1. [Citation: IRM 1.x.x.x] Internal governance placeholder.
2. [Citation: IRM 4.x.x.x] Examination procedures placeholder.
3. [Citation: IRM 5.x.x.x] Collections procedures placeholder.
4. [Citation: IRM 21.x.x.x] Account management placeholder.
5. [Citation: IRC sec. 6012] Filing requirement placeholder.
6. [Citation: IRC sec. 6103] Confidentiality placeholder.
7. [Citation: IRC sec. 6159] Installment agreement placeholder.
8. [Citation: IRC sec. 6213] Deficiency petition timeline placeholder.
9. [Citation: IRC sec. 6656] Employment deposit penalty placeholder.
