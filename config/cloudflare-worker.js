const CLOUDFLARE_WORKER = {
    version: "1.0",
    workerName: "RTPSC Cloudflare Edge Worker",
    posture: "edge-read-only-live-feed-proxy",
    wranglerConfig: "wrangler.toml",
    entrypoint: "cloudflare/worker.mjs",
    routes: ["/health", "/live-feed", "/system-health", "/actions", "/ws-manifest"],
    bindings: {
        environment: "ENVIRONMENT",
        runtime: "RTPSC_RUNTIME"
    },
    commands: {
        dev: "npm run cf:dev",
        deploy: "npm run cf:deploy",
        check: "npm run cf:check"
    },
    guardrails: [
        "no-secret-rendering",
        "read-only-default",
        "review-required-before-deploy",
        "signed-envelope-before-external-transmission"
    ]
};

module.exports = { CLOUDFLARE_WORKER };
