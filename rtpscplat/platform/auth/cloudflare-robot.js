function getCloudflareRobotConfig() {
    const siteKey = process.env.CLOUDFLARE_TURNSTILE_SITE_KEY || '';
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '';

    return {
        provider: 'Cloudflare Turnstile',
        siteKey,
        hasSiteKey: Boolean(siteKey),
        hasSecretKey: Boolean(secretKey),
        mode: secretKey ? 'ENFORCED' : 'CONFIG_REQUIRED'
    };
}

async function validateCloudflareRobotToken(input = {}, options = {}) {
    const config = getCloudflareRobotConfig();
    const token = String(input.token || '').trim();
    const remoteip = String(input.remoteip || '').trim();

    if (!token) {
        return {
            ok: false,
            reason: 'TOKEN_REQUIRED',
            provider: config.provider
        };
    }

    if (!config.hasSecretKey) {
        return {
            ok: false,
            reason: 'SECRET_KEY_NOT_CONFIGURED',
            provider: config.provider,
            mode: config.mode
        };
    }

    const fetchImpl = options.fetchImpl || fetch;
    const form = new URLSearchParams();
    form.set('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '');
    form.set('response', token);
    if (remoteip) {
        form.set('remoteip', remoteip);
    }

    try {
        const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form.toString()
        });

        const payload = await response.json();
        return {
            ok: Boolean(payload.success),
            provider: config.provider,
            challengeTs: payload['challenge_ts'] || null,
            hostname: payload.hostname || null,
            action: payload.action || null,
            errorCodes: payload['error-codes'] || [],
            cdata: payload.cdata || null
        };
    } catch (error) {
        return {
            ok: false,
            reason: 'VALIDATION_REQUEST_FAILED',
            provider: config.provider,
            error: error.message
        };
    }
}

module.exports = {
    getCloudflareRobotConfig,
    validateCloudflareRobotToken
};
