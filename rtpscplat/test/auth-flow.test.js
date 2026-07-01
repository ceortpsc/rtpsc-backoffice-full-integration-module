const test = require('node:test');
const assert = require('node:assert/strict');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const {
  authenticateUser,
  checkPermission,
  createClientFile,
  validateCredentialAccess,
  registerMfaEnrollment,
  enableMfaEnrollment,
  verifyMfaChallenge
} = require('../platform/auth/service');

function fromBase32(secret) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const normalized = String(secret || '').toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (const char of normalized) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) {
      throw new Error('Invalid base32 secret');
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

function buildTotpToken(secret, timeMs = Date.now()) {
  const key = fromBase32(secret);
  const counter = Math.floor(timeMs / 1000 / 30);
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

function createTestDb() {
  const db = new sqlite3.Database(':memory:');

  const schema = `
    CREATE TABLE auth_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      login_type TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE owner_credentials (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL
    );
    CREATE TABLE roles (id TEXT PRIMARY KEY, code TEXT NOT NULL);
    CREATE TABLE permissions (id TEXT PRIMARY KEY, code TEXT NOT NULL);
    CREATE TABLE role_permissions (role_id TEXT NOT NULL, permission_id TEXT NOT NULL, PRIMARY KEY (role_id, permission_id));
    CREATE TABLE user_roles (user_id TEXT NOT NULL, role_id TEXT NOT NULL, PRIMARY KEY (user_id, role_id));
    CREATE TABLE clients (id TEXT PRIMARY KEY, user_id TEXT NOT NULL);
    CREATE TABLE client_files (id TEXT PRIMARY KEY, client_id TEXT NOT NULL, file_type TEXT NOT NULL, file_name TEXT NOT NULL, file_url TEXT NOT NULL, uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

test('authenticateUser accepts the seeded owner credentials', async () => {
  const db = await createTestDb();
  const passwordHash = 'demo-hash';
  const ownerId = 'owner-1';

  await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO owner_credentials (id, username, password_hash, full_name, email) VALUES (?, ?, ?, ?, ?)',
      [ownerId, 'condreros', passwordHash, 'Condre Dvon Ross', 'ceo@rosstaxsoftware.com'],
      (err) => (err ? reject(err) : resolve())
    );
  });

  const result = await authenticateUser(db, 'condreros', 'Houston1!', { ownerTable: 'owner_credentials' });
  assert.equal(result.ok, true);
  assert.equal(result.user.id, ownerId);
  db.close();
});

test('checkPermission returns true when the role grants the requested permission', async () => {
  const db = await createTestDb();
  await new Promise((resolve, reject) => {
    db.exec(`
      INSERT INTO roles (id, code) VALUES ('role-admin', 'ERO_ADMIN');
      INSERT INTO permissions (id, code) VALUES ('perm-run-efile', 'RUN_EFILE');
      INSERT INTO role_permissions (role_id, permission_id) VALUES ('role-admin', 'perm-run-efile');
      INSERT INTO auth_users (id, username, password_hash, login_type, first_name, last_name, email) VALUES ('user-1', 'ero.operator.001', 'hash', 'ERO_USER', 'Jonathan', 'Sterling', 'ero@example.com');
      INSERT INTO user_roles (user_id, role_id) VALUES ('user-1', 'role-admin');
    `, (err) => (err ? reject(err) : resolve()));
  });

  const allowed = await checkPermission(db, 'user-1', 'RUN_EFILE');
  assert.equal(allowed, true);
  db.close();
});

test('createClientFile stores metadata for a client upload', async () => {
  const db = await createTestDb();
  await new Promise((resolve, reject) => {
    db.run('INSERT INTO clients (id, user_id) VALUES (?, ?)', ['client-1', 'user-1'], (err) => (err ? reject(err) : resolve()));
  });

  const file = await createClientFile(db, 'client-1', 'ID_CARD', 'id-card.pdf', 'https://example.invalid/id-card.pdf');
  assert.equal(file.file_type, 'ID_CARD');
  assert.equal(file.file_name, 'id-card.pdf');
  db.close();
});

test('MFA registration and enablement work with TOTP token', async () => {
  const enrollment = registerMfaEnrollment({
    userId: 'owner-1',
    username: 'ceo@rosstaxsoftware.com',
    issuer: 'ROSS TAX PRO'
  });

  assert.equal(enrollment.enabled, false);
  assert.equal(typeof enrollment.otpAuthUri, 'string');
  assert.equal(enrollment.backupCodes.length, 8);

  const token = buildTotpToken(enrollment.secret);
  const enableResult = enableMfaEnrollment({ enrollmentId: enrollment.enrollmentId, token });
  assert.equal(enableResult.ok, true);
  assert.equal(enableResult.userId, 'owner-1');

  const verifyResult = verifyMfaChallenge({ userId: 'owner-1', token });
  assert.equal(verifyResult.ok, true);
  assert.equal(verifyResult.method, 'TOTP');
});

test('MFA verify accepts backup code after enrollment is enabled', async () => {
  const enrollment = registerMfaEnrollment({
    userId: 'user-2',
    username: 'ops@rosstaxsoftware.com'
  });

  const token = buildTotpToken(enrollment.secret);
  const enableResult = enableMfaEnrollment({ enrollmentId: enrollment.enrollmentId, token });
  assert.equal(enableResult.ok, true);

  const backupCode = enrollment.backupCodes[0];
  const verifyBackup = verifyMfaChallenge({ userId: 'user-2', backupCode });
  assert.equal(verifyBackup.ok, true);
  assert.equal(verifyBackup.method, 'BACKUP_CODE');

  const secondUse = verifyMfaChallenge({ userId: 'user-2', backupCode });
  assert.equal(secondUse.ok, false);
  assert.equal(secondUse.reason, 'MFA_CHALLENGE_FAILED');
});

test('validateCredentialAccess requires credentials and MFA', async () => {
  const db = await createTestDb();

  const missingCredentials = await validateCredentialAccess(db, {}, 'RUN_EFILE');
  assert.equal(missingCredentials.ok, false);
  assert.equal(missingCredentials.reason, 'CREDENTIALS_REQUIRED');

  const missingMfa = await validateCredentialAccess(db, { username: 'nobody', password: 'x' }, 'RUN_EFILE');
  assert.equal(missingMfa.ok, false);
  assert.equal(missingMfa.reason, 'MFA_REQUIRED');
  db.close();
});

test('validateCredentialAccess grants owner credentials and role permission', async () => {
  const db = await createTestDb();
  await new Promise((resolve, reject) => {
    db.exec(`
      INSERT INTO owner_credentials (id, username, password_hash, full_name, email) VALUES ('owner-1', 'condreros', 'demo-hash', 'Condre Dvon Ross', 'ceo@rosstaxsoftware.com');
      INSERT INTO roles (id, code) VALUES ('role-admin', 'ERO_ADMIN');
      INSERT INTO permissions (id, code) VALUES ('perm-run-efile', 'RUN_EFILE');
      INSERT INTO role_permissions (role_id, permission_id) VALUES ('role-admin', 'perm-run-efile');
      INSERT INTO auth_users (id, username, password_hash, login_type, first_name, last_name, email) VALUES ('user-1', 'ero.operator.001', 'demo-hash', 'ERO_USER', 'Jonathan', 'Sterling', 'ero@example.com');
      INSERT INTO user_roles (user_id, role_id) VALUES ('user-1', 'role-admin');
    `, (err) => (err ? reject(err) : resolve()));
  });

  const ownerAccess = await validateCredentialAccess(db, {
    username: 'condreros',
    password: 'Houston1!',
    mfaVerified: true
  }, 'RUN_EFILE');
  assert.equal(ownerAccess.ok, true);
  assert.equal(ownerAccess.role, 'OWNER_ADMIN');

  const roleAccess = await validateCredentialAccess(db, {
    username: 'ero.operator.001',
    password: 'Houston1!',
    mfaVerified: true
  }, 'RUN_EFILE');
  assert.equal(roleAccess.ok, true);
  assert.equal(roleAccess.permissionCode, 'RUN_EFILE');

  const deniedAccess = await validateCredentialAccess(db, {
    username: 'ero.operator.001',
    password: 'Houston1!',
    mfaVerified: true
  }, 'MANAGE_PAYROLL');
  assert.equal(deniedAccess.ok, false);
  assert.equal(deniedAccess.reason, 'PERMISSION_DENIED');
  db.close();
});
