# Operations Runbook

## Daily Execution Checklist
- Verify the gateway login page loads from `public/index.xhtml`.
- Confirm the dashboard and e-file modules are reachable.
- Review MEF queue status and any rejection backlog.
- Validate that envelope and signature metadata include timestamp and location fields.

## Incident Response
1. Re-run the scaffolding generator if the public package is missing files.
2. Inspect `metadata.json` for environment parameters.
3. Reconcile queue and acknowledgement logs before re-transmitting.
