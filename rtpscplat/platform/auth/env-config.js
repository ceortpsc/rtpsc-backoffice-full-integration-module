function getEnvConfig() {
  const values = {
    sbtpg: {
      username: process.env.SBTPG_USERNAME || 'condreros',
      password: process.env.SBTPG_PASSWORD || 'Houston12!',
      adminOwnerUsername: process.env.SBTPG_ADMIN_OWNER_USERNAME || 'condreros',
      adminOwnerPassword: process.env.SBTPG_ADMIN_OWNER_PASSWORD || 'Houston12!',
      creditalUsername: process.env.SBTPG_CREDITAIL_USERNAME || 'condreros',
      creditalPassword: process.env.SBTPG_CREDITAIL_PASSWORD || 'Houston12!',
      creditalEmail: process.env.SBTPG_CREDITAIL_EMAIL || 'condrerosross@gmail.com',
      creditalAdminEmail: process.env.SBTPG_CREDITAIL_ADMIN_EMAIL || 'condrerosross@gmail.com',
      creditalAdminPassword: process.env.SBTPG_CREDITAIL_ADMIN_PASSWORD || 'Houston1!',
      environment: process.env.SBTPG_ENVIRONMENT || 'development',
      syncMode: process.env.SBTPG_SYNC_MODE || 'manual'
    },
    ai: {
      provider: process.env.AI_PROVIDER || 'openai-compatible',
      baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
      apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      temperature: Number(process.env.AI_TEMPERATURE || '0.2')
    }
  };

  return values;
}

module.exports = {
  getEnvConfig
};
