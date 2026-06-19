<#
RTPSC Windows Application Shell environment bootstrap.
Copy this file locally and replace placeholder values with secrets from your approved secret manager.
Do not commit live credentials or generated .env files.
#>

$env:ENABLE_LIVE_FEED_API = "true"
$env:LIVE_FEED_API_PORT = "8787"
$env:VANTAGE_DB_PASSWORD = "<set-from-secret-manager>"
$env:MODEL_API_KEY = "<set-from-secret-manager>"
$env:OIDC_ISSUER_URI = "<set-from-identity-provider>"
$env:OIDC_AUDIENCE = "<set-from-identity-provider>"
$env:EMPLOYEE_OAUTH_ISSUER = "<set-from-identity-provider>"
$env:EMPLOYEE_OAUTH_AUDIENCE = "<set-from-identity-provider>"
$env:MONGODB_SERVICE_ACCOUNT_CLIENT_ID = "<set-from-secret-manager>"
$env:MONGODB_SERVICE_ACCOUNT_CLIENT_SECRET = "<set-from-secret-manager>"
$env:MONGODB_SERVICE_ACCOUNT_ACCESS_LIST = "<set-from-approved-access-list>"

Write-Host "RTPSC Windows application shell environment variables staged for this PowerShell session."
Write-Host "Run: node .\\server.js"
