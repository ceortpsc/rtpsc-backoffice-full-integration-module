# RTPSC AWS S3 Zip Deployment Blueprint

This blueprint packages the RTPSC backoffice integration module for AWS S3 or AWS Amplify "Deploy without Git" review flows without committing live AWS, MongoDB Atlas, or operator secrets.

## Required environment variables

- `RTPSC_DEPLOYMENT_BUCKET` - target private S3 bucket name.
- `RTPSC_DEPLOYMENT_PREFIX` - optional object prefix such as `releases/staging`.
- `ATLAS_AWS_ACCOUNT_ARN` - MongoDB Atlas AWS account ARN copied from Atlas when configuring S3 integration.
- `ATLAS_AWS_EXTERNAL_ID` - MongoDB Atlas external ID copied from Atlas.

## Package locally

```bash
npm run package:aws
```

The script writes `dist/rtpsc-backoffice-deployment.zip` and excludes `.env`, `.git`, `node_modules`, generated zip files, PDFs, spreadsheets, CSV exports, and the authorized 8821 vault.

## Upload after review

```bash
aws s3 cp dist/rtpsc-backoffice-deployment.zip "s3://$RTPSC_DEPLOYMENT_BUCKET/${RTPSC_DEPLOYMENT_PREFIX:-releases/staging}/rtpsc-backoffice-deployment.zip" --sse AES256
```

## Atlas trust policy

Use `docs/aws/atlas-trust-policy.template.json` as a placeholder template only. Substitute values from secure environment variables or a secret manager at deployment time. Do not commit live account IDs, external IDs, AWS access keys, Atlas service account secrets, or MongoDB passwords.

## AWS Amplify build specification

The repository includes `amplify.yml` for copy/paste or direct Amplify detection. The build spec installs production dependencies, runs `npm run check:vantage:db`, validates `server.js`, runs the dry-run self-healing worker, and publishes the static operator surfaces from `amplify-dist`. Keep live credentials in Amplify environment variables or AWS Secrets Manager only; do not paste credentials into the build spec.

## Guardrails

- Keep S3 public access block enabled.
- Enable bucket versioning for release rollback.
- Require manual review before promoting a zip from staging to production.
- Treat the package as a static/runtime artifact, not a live IRS transmittal release.
