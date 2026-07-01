const test = require('node:test');
const assert = require('node:assert/strict');
const { getCloudflareRobotConfig, validateCloudflareRobotToken } = require('../platform/auth/cloudflare-robot');

test('getCloudflareRobotConfig reports config-required mode when keys are missing', () => {
    const originalSiteKey = process.env.CLOUDFLARE_TURNSTILE_SITE_KEY;
    const originalSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    delete process.env.CLOUDFLARE_TURNSTILE_SITE_KEY;
    delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    const config = getCloudflareRobotConfig();
    assert.equal(config.hasSiteKey, false);
    assert.equal(config.hasSecretKey, false);
    assert.equal(config.mode, 'CONFIG_REQUIRED');

    if (originalSiteKey !== undefined) process.env.CLOUDFLARE_TURNSTILE_SITE_KEY = originalSiteKey;
    if (originalSecretKey !== undefined) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = originalSecretKey;
});

test('validateCloudflareRobotToken requires token and secret key', async () => {
    const originalSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    const missingToken = await validateCloudflareRobotToken({ token: '' });
    assert.equal(missingToken.ok, false);
    assert.equal(missingToken.reason, 'TOKEN_REQUIRED');

    const missingSecret = await validateCloudflareRobotToken({ token: 'token-value' });
    assert.equal(missingSecret.ok, false);
    assert.equal(missingSecret.reason, 'SECRET_KEY_NOT_CONFIGURED');

    if (originalSecretKey !== undefined) process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = originalSecretKey;
});

test('validateCloudflareRobotToken returns success payload from verification response', async () => {
    const originalSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = 'secret-value';

    const fakeFetch = async () => ({
        async json() {
            return {
                success: true,
                hostname: 'localhost',
                action: 'submit-form',
                cdata: 'sample-cdata',
                'error-codes': []
            };
        }
    });

    const result = await validateCloudflareRobotToken({ token: 'token-value', remoteip: '127.0.0.1' }, { fetchImpl: fakeFetch });
    assert.equal(result.ok, true);
    assert.equal(result.hostname, 'localhost');
    assert.equal(result.action, 'submit-form');

    if (originalSecretKey !== undefined) {
        process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY = originalSecretKey;
    } else {
        delete process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    }
});
