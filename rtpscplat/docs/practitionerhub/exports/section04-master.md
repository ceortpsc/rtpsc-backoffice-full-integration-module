# 04 - IRS Communication Tunnels Module

## Overview

The IRS Tunnel module maintains persistent, encrypted communications with IRS internal systems for real-time data exchange including transcripts, account status, CAF authorization verification, and compliance pulls.

---

## Tunnel Types

| Tunnel | Purpose | Protocol | IRS Endpoint |
| --- | --- | --- | --- |
| Transcript Delivery | Tax transcripts via TDS | HTTPS/mTLS | irs.gov/tds |
| CAF Authorization | POA/TIA validation | HTTPS/mTLS | irs.gov/caf |
| Account Status | Real-time account inquiry | HTTPS/mTLS | irs.gov/acct |
| CP Notice Feed | Compliance notice delivery | SFTP/TLS | irs.gov/notices |
| TC Pull | Transaction code queries | HTTPS/mTLS | irs.gov/rtd |

---

## Connection Parameters

```yaml
irs_tunnel:
  efin: "748335"
  keep_alive_interval_seconds: 60
  max_concurrent_sessions: 10
  psk_rotation_days: 30
  dead_peer_detection: true
  reconnect_on_drop: true
  reconnect_attempts: 5
  reconnect_backoff_seconds: [5, 10, 20, 40, 60]
  tls_version: "1.3"
  cipher_suite: "TLS_AES_256_GCM_SHA384"
  mutual_tls: true
  client_cert_path: "/certs/irs-client.pfx"
```

## Tunnel Session Lifecycle

```text
[Tunnel Engine Start]
  -> [Load mTLS Certificate (EFIN 748335)]
  -> [Initiate Handshake with IRS Endpoint]
  -> [Session Established, Session ID logged]
  -> [Keep-Alive Pings every 60s]
  -> [Request/Response Exchange]
  -> [Session Termination or Dead Peer Detection]
  -> [Automatic Reconnection]
```

---

## Transcript Request Types

| Transcript Type | IRS Code | Use Case |
| --- | --- | --- |
| Tax Return Transcript | TRDBV | Verify filed return |
| Tax Account Transcript | TXACT | TC codes, payments, penalties |
| Wage and Income Transcript | WIGE | W-2/1099 cross-reference |
| Record of Account | RECA | Combined return and account |
| Verification of Non-Filing | VONF | Confirm no return filed |

## CAF Authorization Levels

| Level | Code | Scope |
| --- | --- | --- |
| Full Representation | A | All matters |
| Limited Representation | F | Specific tax periods |
| Information Only | Q | Transcripts only |
| Disclosure Only | D | Third-party disclosure |

---

## Security Requirements

- PSK is EFIN-specific and must not be shared across EFINs.
- mTLS client certificate must match IRS-issued certificate for EFIN 748335.
- All tunnel traffic is logged to immutable audit storage.
- PII in tunnel responses is masked in application logs (for example, SSN -> XXX-XX-XXXX).

### SLA and Monitoring

- Tunnel uptime SLA target: 99.9%
- Certificate expiry alert threshold: 90 days

| Metric | Alert Threshold | Critical Threshold |
| --- | --- | --- |
| Tunnel Uptime | < 99.5% | < 99.0% |
| Session Reconnects/hour | > 3 | > 10 |
| Request Latency (p95) | > 2000ms | > 5000ms |
| Certificate Expiry | < 90 days | < 30 days |
| PSK Age | > 25 days | > 30 days |
