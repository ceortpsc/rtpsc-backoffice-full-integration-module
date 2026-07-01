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
    }
  };

  return values;
}

module.exports = {
  getEnvConfig
};
