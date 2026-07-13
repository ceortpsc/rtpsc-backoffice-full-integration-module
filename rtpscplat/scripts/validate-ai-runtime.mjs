#!/usr/bin/env node
import crypto from 'node:crypto';

function base32ToBuffer(secret) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const normalized = String(secret || '').toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (const char of normalized) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) {
      throw new Error('INVALID_BASE32_SECRET');
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function buildTotp(secret) {
  const key = base32ToBuffer(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac('sha1', key).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff);
  return String(binary % 1000000).padStart(6, '0');
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, body };
}

async function main() {
  const base = process.env.RTP_API_BASE_URL || 'http://127.0.0.1:8080';

  const register = await postJson(`${base}/api/auth/mfa/register`, {
    userId: 'owner-condre-ross',
    username: 'condreros',
    issuer: 'ROSS TAX PRO'
  });

  if (!register.ok) {
    throw new Error(`MFA_REGISTER_FAILED: ${JSON.stringify(register.body)}`);
  }

  const token = buildTotp(register.body.secret);
  const enable = await postJson(`${base}/api/auth/mfa/enable`, {
    enrollmentId: register.body.enrollmentId,
    token
  });

  if (!enable.ok) {
    throw new Error(`MFA_ENABLE_FAILED: ${JSON.stringify(enable.body)}`);
  }

  const aiAssist = await postJson(`${base}/api/ai/provider/assist`, {
    credentials: {
      username: 'condreros',
      password: 'Houston1!',
      enrollmentId: register.body.enrollmentId,
      backupCode: enable.body.backupCodes[0]
    },
    taskType: 'operations_summary',
    prompt: 'Summarize current filing control priorities for open high risk notices.',
    context: {
      office: '254-KIL-ERO',
      queue: 'priority'
    }
  });

  const auditUrl = new URL(`${base}/api/ai/provider/audit`);
  auditUrl.searchParams.set('username', 'condreros');
  auditUrl.searchParams.set('password', 'Houston1!');
  auditUrl.searchParams.set('enrollmentId', register.body.enrollmentId);
  auditUrl.searchParams.set('backupCode', enable.body.backupCodes[1]);
  auditUrl.searchParams.set('limit', '3');

  const auditResponse = await fetch(auditUrl);
  const auditBody = await auditResponse.json().catch(() => ({}));

  process.stdout.write(JSON.stringify({
    registerStatus: register.status,
    enableStatus: enable.status,
    aiStatus: aiAssist.status,
    aiBody: aiAssist.body,
    auditStatus: auditResponse.status,
    auditCount: Array.isArray(auditBody.logs) ? auditBody.logs.length : 0,
    auditLatestRoute: auditBody.logs?.[0]?.route || null,
    auditLatestResult: auditBody.logs?.[0]?.response_status || null
  }, null, 2) + '\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});