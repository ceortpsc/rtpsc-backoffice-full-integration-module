#!/usr/bin/env bash
set -euo pipefail

mkdir -p logs reports

while true; do
  TS="$(date +%Y%m%d_%H%M%S)"

  curl -s -X POST http://127.0.0.1:8790/api/workers/refund-status-fetch \
    -H "Content-Type: application/json" \
    -d '{
      "job":"refund_status_fetch",
      "source":"authorized_internal_api",
      "returnType":"1040X",
      "client":"CARSON MCCONNELL",
      "returnId":"152ac12e-45e2-459f-b93d-d7b5dc2f0996",
      "submissionId":"74833520260648324095",
      "requireHumanReview":true,
      "maskIdentifiers":true,
      "prohibitScraping":true
    }' | tee "reports/refund_status_$TS.json"

  echo "$(date -Is) worker completed" >> logs/refund_worker.log
  sleep 900
done
