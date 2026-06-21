const AWS_DEPLOYMENT = {
    version: "1.0",
    deploymentName: "RTPSC AWS S3 Zip Deployment",
    posture: "package-upload-review-promote",
    regions: ["us-east-1"],
    packageName: "rtpsc-backoffice-deployment.zip",
    trustRelationship: {
        atlasAwsAccountArnEnvironmentVariable: "ATLAS_AWS_ACCOUNT_ARN",
        externalIdEnvironmentVariable: "ATLAS_AWS_EXTERNAL_ID",
        policyTemplate: "docs/aws/atlas-trust-policy.template.json",
        note: "Use environment variables or AWS Secrets Manager; do not commit account ARNs, external IDs, access keys, or bucket credentials."
    },
    s3: {
        bucketEnvironmentVariable: "RTPSC_DEPLOYMENT_BUCKET",
        prefixEnvironmentVariable: "RTPSC_DEPLOYMENT_PREFIX",
        encryption: "SSE-S3-or-KMS-required",
        publicAccessBlockRequired: true,
        versioningRecommended: true
    },
    amplify: {
        supportedSource: "Deploy without Git from S3 or zip file",
        buildRoot: ".",
        buildSpec: "amplify.yml",
        artifacts: ["advanced-presentation.html", "report-engine.html", "forms-cabinet.html", "billing-dashboard.html", "rosssign-pad.html"]
    },
    packaging: {
        script: "scripts/package-aws-deployment.sh",
        outputDirectory: "dist",
        include: ["assets", "app", "config", "docs", "lib", "scripts", "*.html", "*.js", "package.json", "amplify.yml", "next.config.js"],
        include: ["assets", "config", "docs", "scripts", "*.html", "*.js", "package.json", "amplify.yml"],
        exclude: [".git", ".env", "node_modules", "dist", "authorized_8821_vault", "*.pdf", "*.xlsx", "*.csv", "*.zip"]
    },
    safeguards: [
        "secret-scan-before-package",
        "exclude-client-vault-documents",
        "exclude-generated-zip-artifacts",
        "environment-only-aws-bindings",
        "manual-review-before-s3-upload",
        "no-live-transmission-from-static-package"
    ]
};

module.exports = { AWS_DEPLOYMENT };
