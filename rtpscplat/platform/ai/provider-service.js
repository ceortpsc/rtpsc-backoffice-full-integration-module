const { getEnvConfig } = require('../auth/env-config');

function trimText(value, maxLength = 1200) {
    return String(value || '').trim().slice(0, maxLength);
}

function buildMessages(input = {}) {
    const systemPrompt = trimText(
        input.systemPrompt
        || 'You are a tax operations AI assistant. Respond with compliance-aware, audit-ready guidance that stays within documented policy and IRS procedure placeholders.',
        2000
    );

    const prompt = trimText(input.prompt, 12000);
    const context = input.context ? trimText(JSON.stringify(input.context), 4000) : '';
    const taskType = trimText(input.taskType || 'general_assist', 120);

    if (!prompt) {
        throw new Error('PROMPT_REQUIRED');
    }

    const userContent = context
        ? `Task Type: ${taskType}\nContext: ${context}\nPrompt: ${prompt}`
        : `Task Type: ${taskType}\nPrompt: ${prompt}`;

    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
    ];
}

function summarizeRequest(input = {}) {
    return trimText(`task=${input.taskType || 'general_assist'} prompt=${input.prompt || ''}`, 300);
}

async function requestAiCompletion(input = {}, options = {}) {
    const config = options.config || getEnvConfig().ai;
    const fetchImpl = options.fetchImpl || global.fetch;

    if (!fetchImpl) {
        throw new Error('FETCH_UNAVAILABLE');
    }

    if (!config.apiKey) {
        throw new Error('AI_PROVIDER_NOT_CONFIGURED');
    }

    const endpoint = `${String(config.baseUrl).replace(/\/$/, '')}/chat/completions`;
    const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            temperature: typeof input.temperature === 'number' ? input.temperature : config.temperature,
            messages: buildMessages(input)
        })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error?.message || payload.message || `AI_PROVIDER_HTTP_${response.status}`);
    }

    return {
        provider: config.provider,
        model: config.model,
        completionId: payload.id || null,
        outputText: payload.choices?.[0]?.message?.content || '',
        usage: payload.usage || null,
        finishReason: payload.choices?.[0]?.finish_reason || null
    };
}

module.exports = {
    requestAiCompletion,
    summarizeRequest
};