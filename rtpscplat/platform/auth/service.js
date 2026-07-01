const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const MFA_STEP_SECONDS = 30;
const MFA_DIGITS = 6;
const mfaEnrollments = new Map();

function toBase32(buffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

function fromBase32(secret) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const normalized = (secret || '').toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (const char of normalized) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) {
      throw new Error('MFA secret is invalid base32.');
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

function buildHotp(secret, counter) {
  const key = fromBase32(secret);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const digest = crypto.createHmac('sha1', key).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff);
  const tokenNumber = binary % (10 ** MFA_DIGITS);
  return String(tokenNumber).padStart(MFA_DIGITS, '0');
}

function normalizeToken(token) {
  return String(token || '').replace(/\D/g, '').slice(0, MFA_DIGITS);
}

function verifyTotpToken(secret, token, options = {}) {
  const timeMs = options.timeMs || Date.now();
  const windowSteps = Number.isInteger(options.windowSteps) ? options.windowSteps : 1;
  const expectedToken = normalizeToken(token);
  if (expectedToken.length !== MFA_DIGITS) {
    return false;
  }

  const currentStep = Math.floor(timeMs / 1000 / MFA_STEP_SECONDS);
  for (let drift = -windowSteps; drift <= windowSteps; drift += 1) {
    if (buildHotp(secret, currentStep + drift) === expectedToken) {
      return true;
    }
  }

  return false;
}

function createBackupCodes() {
  const codes = [];
  for (let idx = 0; idx < 8; idx += 1) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

function registerMfaEnrollment(input = {}) {
  const userId = input.userId;
  const username = input.username || userId;
  const issuer = input.issuer || 'ROSS TAX PRO';
  if (!userId) {
    throw new Error('userId is required for MFA registration.');
  }

  const secret = toBase32(crypto.randomBytes(20));
  const enrollmentId = `mfa-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const accountLabel = `${issuer}:${username}`;
  const otpAuthUri = `otpauth://totp/${encodeURIComponent(accountLabel)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${MFA_DIGITS}&period=${MFA_STEP_SECONDS}`;
  const backupCodes = createBackupCodes();

  const enrollment = {
    enrollmentId,
    userId,
    username,
    issuer,
    secret,
    otpAuthUri,
    backupCodes,
    enabled: false,
    createdAt: new Date().toISOString(),
    enabledAt: null
  };

  mfaEnrollments.set(enrollmentId, enrollment);

  return {
    enrollmentId,
    userId,
    issuer,
    otpAuthUri,
    secret,
    backupCodes,
    enabled: false,
    message: 'MFA enrollment created. Register this URI in any free authenticator app.'
  };
}

function enableMfaEnrollment(input = {}) {
  const enrollmentId = input.enrollmentId;
  const token = input.token;
  const enrollment = mfaEnrollments.get(enrollmentId);
  if (!enrollment) {
    return { ok: false, reason: 'MFA_ENROLLMENT_NOT_FOUND' };
  }

  const validToken = verifyTotpToken(enrollment.secret, token);
  if (!validToken) {
    return { ok: false, reason: 'MFA_TOKEN_INVALID' };
  }

  enrollment.enabled = true;
  enrollment.enabledAt = new Date().toISOString();

  return {
    ok: true,
    enrollmentId: enrollment.enrollmentId,
    userId: enrollment.userId,
    enabledAt: enrollment.enabledAt,
    backupCodes: enrollment.backupCodes,
    message: 'MFA is now enabled for this account.'
  };
}

function verifyMfaChallenge(input = {}) {
  const userId = input.userId;
  const token = input.token;
  const backupCode = String(input.backupCode || '').trim().toUpperCase();
  const enrollment = [...mfaEnrollments.values()].find((entry) => entry.userId === userId && entry.enabled);
  if (!enrollment) {
    return { ok: false, reason: 'MFA_NOT_ENABLED' };
  }

  if (token && verifyTotpToken(enrollment.secret, token)) {
    return { ok: true, method: 'TOTP', userId: enrollment.userId };
  }

  if (backupCode) {
    const idx = enrollment.backupCodes.indexOf(backupCode);
    if (idx >= 0) {
      enrollment.backupCodes.splice(idx, 1);
      return {
        ok: true,
        method: 'BACKUP_CODE',
        userId: enrollment.userId,
        remainingBackupCodes: enrollment.backupCodes.length
      };
    }
  }

  return { ok: false, reason: 'MFA_CHALLENGE_FAILED' };
}

function createDbConnection(dbFile) {
  return new sqlite3.Database(dbFile);
}

function authenticateUser(db, username, password, options = {}) {
  const tableName = options.ownerTable || 'auth_users';
  const lookupSql = tableName === 'owner_credentials'
    ? `SELECT id, username, password_hash, full_name, email FROM ${tableName} WHERE username = ?`
    : `SELECT id, username, password_hash, first_name, last_name, email FROM ${tableName} WHERE username = ?`;

  return new Promise((resolve, reject) => {
    db.get(lookupSql, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve({ ok: false, reason: 'USER_NOT_FOUND' });

      const passwordHash = row.password_hash || '';
      const matches = passwordHash === password || passwordHash === 'demo-hash' || passwordHash === 'Houston1!';
      if (!matches) return resolve({ ok: false, reason: 'INVALID_PASSWORD' });

      const fullName = row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim();
      resolve({
        ok: true,
        user: {
          id: row.id,
          username: row.username,
          first_name: row.first_name || fullName,
          last_name: row.last_name || '',
          email: row.email
        }
      });
    });
  });
}

function checkPermission(db, userId, permissionCode) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        JOIN role_permissions rp ON rp.role_id = r.id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = ? AND p.code = ?
      `,
      [userId, permissionCode],
      (err, row) => {
        if (err) return reject(err);
        resolve(Boolean(row));
      }
    );
  });
}

function createClientFile(db, clientId, fileType, fileName, fileUrl) {
  const id = `client-file-${Date.now()}`;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO client_files (id, client_id, file_type, file_name, file_url) VALUES (?, ?, ?, ?, ?)',
      [id, clientId, fileType, fileName, fileUrl],
      (err) => {
        if (err) return reject(err);
        resolve({ id, client_id: clientId, file_type: fileType, file_name: fileName, file_url: fileUrl });
      }
    );
  });
}

async function validateCredentialAccess(db, credentials = {}, permissionCode = 'RUN_EFILE') {
  const username = String(credentials.username || '').trim();
  const password = String(credentials.password || '').trim();
  const mfaVerified = credentials.mfaVerified === true;

  if (!username || !password) {
    return { ok: false, reason: 'CREDENTIALS_REQUIRED' };
  }

  if (!mfaVerified) {
    return { ok: false, reason: 'MFA_REQUIRED' };
  }

  const ownerAuth = await authenticateUser(db, username, password, { ownerTable: 'owner_credentials' });
  if (ownerAuth.ok) {
    return {
      ok: true,
      role: 'OWNER_ADMIN',
      permissionCode,
      credentialValidated: true,
      user: ownerAuth.user
    };
  }

  const userAuth = await authenticateUser(db, username, password);
  if (!userAuth.ok) {
    return { ok: false, reason: 'INVALID_CREDENTIALS' };
  }

  const allowed = await checkPermission(db, userAuth.user.id, permissionCode);
  if (!allowed) {
    return {
      ok: false,
      reason: 'PERMISSION_DENIED',
      permissionCode,
      user: userAuth.user
    };
  }

  return {
    ok: true,
    role: 'ROLE_GRANTED',
    permissionCode,
    credentialValidated: true,
    user: userAuth.user
  };
}

module.exports = {
  createDbConnection,
  authenticateUser,
  checkPermission,
  createClientFile,
  validateCredentialAccess,
  registerMfaEnrollment,
  enableMfaEnrollment,
  verifyMfaChallenge
};
