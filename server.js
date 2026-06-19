const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ESAM_AUTHORIZATIONS } = require('./config/esam-authorizations');
const { VANTAGE_RECONCILIATION_POLICIES } = require('./config/vantage-reconciliation-policies');
const { SECURITY_REDACTION_POLICIES } = require('./config/security-redaction-policies');
const { LIVE_FEED_INTERFACE } = require('./config/live-feed-interface');
const { TRANSMITTAL_MACHINE_INTERFACE } = require('./config/transmittal-machine-interface');
const { LEGAL_NOTICES } = require('./config/legal-notices');
const { TAX_OFFICE_WORKSPACE } = require('./config/tax-office-workspace');
const { TOKEN_AUTHENTICATION } = require('./config/token-authentication');
const { ANDREAA_AI_EMPLOYEE } = require('./config/andreaa-ai-employee');
const { ERO_COMPLIANCE_GATES } = require('./config/ero-compliance-gates');
const { ACCOUNT_ONBOARDING } = require('./config/account-onboarding');
const { SERVICE_CATALOG } = require('./config/service-catalog');
const { ROSSSIGN_ESIGNATURE } = require('./config/rosssign-esignature');
const { WINDOWS_APPLICATION_SHELL } = require('./config/windows-application-shell');
const { FORMS_CABINET } = require('./config/forms-cabinet');
const { BILLING_RECONCILIATION } = require('./config/billing-reconciliation');
const { BRAND_ASSETS } = require('./config/brand-assets');
const { SELF_HEALING_WORKER } = require('./config/self-healing-worker');
const { AWS_DEPLOYMENT } = require('./config/aws-deployment');
const { NEXT_DASHBOARD_MODULES } = require('./config/next-dashboard-modules');

const CONFIG = {
    redisHost: '127.0.0.1',
    redisPort: 6379,
    exportDirectory: 'C:\\TaxProExports',
    hmacSecret: 'CRITICAL_INFRASTRUCTURE_KEY_CHANGE_PROD_ONLY',
    reconnectInterval: 5000,
    parentEnterprise: ESAM_AUTHORIZATIONS.parentEnterpriseIdentity,
    irsProfile: ESAM_AUTHORIZATIONS.apiClientApplication,
    esamAuthorizations: ESAM_AUTHORIZATIONS,
    reconciliationPolicies: VANTAGE_RECONCILIATION_POLICIES,
    securityPolicies: SECURITY_REDACTION_POLICIES,
    liveFeedInterface: LIVE_FEED_INTERFACE,
    apiPort: Number(process.env.LIVE_FEED_API_PORT || LIVE_FEED_INTERFACE.apiServer.defaultPort),
    liveFeedApiEnabled: process.env.ENABLE_LIVE_FEED_API === "true",
    transmittalMachineInterface: TRANSMITTAL_MACHINE_INTERFACE,
    legalNotices: LEGAL_NOTICES,
    taxOfficeWorkspace: TAX_OFFICE_WORKSPACE,
    tokenAuthentication: TOKEN_AUTHENTICATION,
    andreaaAiEmployee: ANDREAA_AI_EMPLOYEE,
    eroComplianceGates: ERO_COMPLIANCE_GATES,
    accountOnboarding: ACCOUNT_ONBOARDING,
    serviceCatalog: SERVICE_CATALOG,
    rossSignEsignature: ROSSSIGN_ESIGNATURE,
    windowsApplicationShell: WINDOWS_APPLICATION_SHELL,
    formsCabinet: FORMS_CABINET,
    billingReconciliation: BILLING_RECONCILIATION,
    brandAssets: BRAND_ASSETS,
    selfHealingWorker: SELF_HEALING_WORKER,
    awsDeployment: AWS_DEPLOYMENT,
    nextDashboardModules: NEXT_DASHBOARD_MODULES
};

if (!fs.existsSync(CONFIG.exportDirectory)) {
    fs.mkdirSync(CONFIG.exportDirectory, { recursive: true });
}

console.log("=====================================================================");
console.log(` INITIALIZING UNBLOCKED FAULT-TOLERANT TUNNEL DEPLOYMENT`);
console.log("=====================================================================");

function generateHmacSignature(payload, secret) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function pushToRedisQueue(queueName, dataPayload) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.setTimeout(3000);
        client.connect(CONFIG.redisPort, CONFIG.redisHost, () => {
            const jsonStr = JSON.stringify(dataPayload);
            const redisCmd = `*3\r\n$5\r\nLPUSH\r\n$${queueName.length}\r\n${queueName}\r\n$${jsonStr.length}\r\n${jsonStr}\r\n`;
            client.write(redisCmd);
        });
        client.on('data', () => { client.destroy(); resolve(true); });
        client.on('timeout', () => { client.destroy(); reject(new Error("TCP Timeout")); });
        client.on('error', (err) => { client.destroy(); reject(err); });
    });
}

function dispatchPipelineTransaction(queueName, payloadEnvelope, retryCount = 0) {
    pushToRedisQueue(queueName, payloadEnvelope)
        .then(() => { 
            console.log(`[🟢 QUEUE SUCCESS] Dispatched to channel [${queueName}].`); 
        })
        .catch(err => {
            console.error(`[🔴 CONNECTION REFUSED ON PORT ${CONFIG.redisPort}] Local server down. Fallback engaged.`);
            const fileTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fallbackPath = path.join(CONFIG.exportDirectory, `FAILSAFE_DROP_${fileTimestamp}.json`);
            fs.writeFileSync(fallbackPath, JSON.stringify(payloadEnvelope, null, 4));
            setTimeout(() => { 
                dispatchPipelineTransaction(queueName, payloadEnvelope, retryCount + 1); 
            }, CONFIG.reconnectInterval);
        });
}

const trackingEnvelope = {
    meta: {
        source: "IRS_ESAM_TUNNEL",
        timestamp: new Date().toISOString(),
        trackingNumber: CONFIG.irsProfile.trackingNumber,
        applicationStatus: CONFIG.irsProfile.applicationStatus
    },
    enterprise: {
        legalName: CONFIG.parentEnterprise.legalName,
        entityType: CONFIG.parentEnterprise.entityType,
        stateOfIncorporation: CONFIG.parentEnterprise.stateOfIncorporation,
        incorporationDate: CONFIG.parentEnterprise.incorporationDate,
        ein: CONFIG.parentEnterprise.ein,
        sCorporationElectionEffectiveDate: CONFIG.parentEnterprise.sCorporationElection.electionEffectiveDate
    },
    firm: {
        legalName: CONFIG.irsProfile.legalName,
        dbaName: CONFIG.irsProfile.dbaName,
        ein: CONFIG.irsProfile.ein
    },
    integration: {
        type: CONFIG.irsProfile.integrationType,
        modules: CONFIG.irsProfile.modules,
        callbackUrl: CONFIG.irsProfile.callbackUrl,
        activeClientIds: CONFIG.irsProfile.apiClients
            .filter((apiClient) => apiClient.status === "Active")
            .map((apiClient) => apiClient.clientId)
    },
    selfHealing: {
        version: CONFIG.selfHealingWorker.version,
        workerName: CONFIG.selfHealingWorker.workerName,
        posture: CONFIG.selfHealingWorker.posture,
        capabilities: CONFIG.selfHealingWorker.capabilities,
        prohibitedActions: CONFIG.selfHealingWorker.prohibitedActions,
        workerScript: CONFIG.selfHealingWorker.workerScript,
        runModes: CONFIG.selfHealingWorker.runModes,
        backgroundQueues: CONFIG.selfHealingWorker.backgroundQueues,
        repairPolicy: CONFIG.selfHealingWorker.repairPolicy,
        presentation: CONFIG.selfHealingWorker.presentation
    },
    awsDeployment: {
        version: CONFIG.awsDeployment.version,
        deploymentName: CONFIG.awsDeployment.deploymentName,
        posture: CONFIG.awsDeployment.posture,
        regions: CONFIG.awsDeployment.regions,
        packageName: CONFIG.awsDeployment.packageName,
        trustRelationship: CONFIG.awsDeployment.trustRelationship,
        s3: CONFIG.awsDeployment.s3,
        amplify: CONFIG.awsDeployment.amplify,
        packaging: CONFIG.awsDeployment.packaging,
        safeguards: CONFIG.awsDeployment.safeguards
    },
    nextDashboard: {
        version: CONFIG.nextDashboardModules.version,
        applicationName: CONFIG.nextDashboardModules.applicationName,
        posture: CONFIG.nextDashboardModules.posture,
        routes: CONFIG.nextDashboardModules.routes,
        apiEndpoints: CONFIG.nextDashboardModules.apiEndpoints,
        websocketChannels: CONFIG.nextDashboardModules.websocketChannels,
        actionAbilities: CONFIG.nextDashboardModules.actionAbilities,
        guardrails: CONFIG.nextDashboardModules.guardrails,
        tooling: CONFIG.nextDashboardModules.tooling
    },
    brand: {
        version: CONFIG.brandAssets.version,
        brandName: CONFIG.brandAssets.brandName,
        palette: CONFIG.brandAssets.palette,
        assets: CONFIG.brandAssets.assets,
        documentSurfaces: CONFIG.brandAssets.documentSurfaces,
        footer: CONFIG.brandAssets.footer
    },
    billing: {
        version: CONFIG.billingReconciliation.version,
        moduleName: CONFIG.billingReconciliation.moduleName,
        posture: CONFIG.billingReconciliation.posture,
        billingPrograms: CONFIG.billingReconciliation.billingPrograms,
        invoiceLifecycle: CONFIG.billingReconciliation.invoiceLifecycle,
        balanceRecovery: CONFIG.billingReconciliation.balanceRecovery,
        accountingTools: CONFIG.billingReconciliation.accountingTools,
        clientFileIntegration: CONFIG.billingReconciliation.clientFileIntegration,
        uiUx: CONFIG.billingReconciliation.uiUx,
        aiAssist: CONFIG.billingReconciliation.aiAssist,
        databaseMigrations: CONFIG.billingReconciliation.databaseMigrations
    },
    formsCabinet: {
        version: CONFIG.formsCabinet.version,
        cabinetName: CONFIG.formsCabinet.cabinetName,
        posture: CONFIG.formsCabinet.posture,
        formLookupTool: CONFIG.formsCabinet.formLookupTool,
        filingCabinet: CONFIG.formsCabinet.filingCabinet,
        editorInterface: CONFIG.formsCabinet.editorInterface,
        esignEnvelope: CONFIG.formsCabinet.esignEnvelope,
        universalTools: CONFIG.formsCabinet.universalTools
    },
    windowsShell: {
        version: CONFIG.windowsApplicationShell.version,
        shellName: CONFIG.windowsApplicationShell.shellName,
        posture: CONFIG.windowsApplicationShell.posture,
        applicationSurfaces: CONFIG.windowsApplicationShell.applicationSurfaces,
        dashboards: CONFIG.windowsApplicationShell.dashboards,
        settingsHubs: CONFIG.windowsApplicationShell.settingsHubs,
        environmentBindings: CONFIG.windowsApplicationShell.environmentBindings,
        oauth2Requirements: CONFIG.windowsApplicationShell.oauth2Requirements,
        endpoints: CONFIG.windowsApplicationShell.endpoints,
        cybersecurityPlacements: CONFIG.windowsApplicationShell.cybersecurityPlacements,
        themePackages: CONFIG.windowsApplicationShell.themePackages,
        tooling: CONFIG.windowsApplicationShell.tooling
    },
    rossSign: {
        version: CONFIG.rossSignEsignature.version,
        applicationName: CONFIG.rossSignEsignature.applicationName,
        posture: CONFIG.rossSignEsignature.posture,
        blueprint: CONFIG.rossSignEsignature.blueprint,
        signingPad: CONFIG.rossSignEsignature.signingPad,
        legalDocuments: CONFIG.rossSignEsignature.legalDocuments,
        terminalAutomation: CONFIG.rossSignEsignature.terminalAutomation,
        communicationsTunnel: CONFIG.rossSignEsignature.communicationsTunnel
    },
    services: {
        version: CONFIG.serviceCatalog.version,
        catalogName: CONFIG.serviceCatalog.catalogName,
        posture: CONFIG.serviceCatalog.posture,
        servicesOffered: CONFIG.serviceCatalog.servicesOffered,
        noticeCoverage: CONFIG.serviceCatalog.noticeCoverage,
        formsCoverage: CONFIG.serviceCatalog.formsCoverage,
        transmittals: CONFIG.serviceCatalog.transmittals,
        freezeAndClearingFramework: CONFIG.serviceCatalog.freezeAndClearingFramework
    },
    accounts: {
        version: CONFIG.accountOnboarding.version,
        workflowName: CONFIG.accountOnboarding.workflowName,
        posture: CONFIG.accountOnboarding.posture,
        roles: CONFIG.accountOnboarding.roles,
        identityFields: CONFIG.accountOnboarding.identityFields,
        overridePinPolicy: CONFIG.accountOnboarding.overridePinPolicy,
        onboardingSteps: CONFIG.accountOnboarding.onboardingSteps,
        accountStatus: CONFIG.accountOnboarding.accountStatus
    },
    compliance: {
        version: CONFIG.eroComplianceGates.version,
        gateName: CONFIG.eroComplianceGates.gateName,
        posture: CONFIG.eroComplianceGates.posture,
        officeConfigurationVariables: CONFIG.eroComplianceGates.officeConfigurationVariables,
        validationChecks: CONFIG.eroComplianceGates.validationChecks,
        releaseRule: CONFIG.eroComplianceGates.releaseRule,
        onboardingWorkflow: CONFIG.eroComplianceGates.onboardingWorkflow
    },
    workspace: {
        version: CONFIG.taxOfficeWorkspace.version,
        workspaceName: CONFIG.taxOfficeWorkspace.workspaceName,
        productClass: CONFIG.taxOfficeWorkspace.productClass,
        mefEnabled: CONFIG.taxOfficeWorkspace.mefEnabled,
        modules: CONFIG.taxOfficeWorkspace.modules,
        uiUx: CONFIG.taxOfficeWorkspace.uiUx,
        transmissionWorkflow: CONFIG.taxOfficeWorkspace.transmissionWorkflow
    },
    legal: {
        version: CONFIG.legalNotices.version,
        effectiveYear: CONFIG.legalNotices.effectiveYear,
        owner: CONFIG.legalNotices.owner,
        copyright: CONFIG.legalNotices.copyright,
        privacyPosture: CONFIG.legalNotices.privacy.posture,
        termsAccessModel: CONFIG.legalNotices.termsAndConditions.accessModel,
        frameworkStructure: CONFIG.legalNotices.frameworkStructure
    },
    liveFeed: {
        version: CONFIG.liveFeedInterface.version,
        interfaceName: CONFIG.liveFeedInterface.interfaceName,
        apiServer: CONFIG.liveFeedInterface.apiServer,
        mongodbFederation: CONFIG.liveFeedInterface.mongodbFederation,
        jobDatasets: CONFIG.liveFeedInterface.jobDatasets,
        automatedPhraser: CONFIG.liveFeedInterface.automatedPhraser,
        irsTunnel: CONFIG.liveFeedInterface.irsTunnel
    },
    transmittalMachine: {
        version: CONFIG.transmittalMachineInterface.version,
        interfaceName: CONFIG.transmittalMachineInterface.interfaceName,
        posture: CONFIG.transmittalMachineInterface.posture,
        sbtpg: CONFIG.transmittalMachineInterface.sbtpg,
        clearingHouse: CONFIG.transmittalMachineInterface.clearingHouse,
        signalGateway: CONFIG.transmittalMachineInterface.signalGateway,
        safeguards: CONFIG.transmittalMachineInterface.safeguards,
        killSwitches: CONFIG.transmittalMachineInterface.killSwitches,
        oauth2EmployeeGate: CONFIG.transmittalMachineInterface.oauth2EmployeeGate,
        dataMigrationSeed: CONFIG.transmittalMachineInterface.dataMigrationSeed
    },
    assistant: {
        version: CONFIG.andreaaAiEmployee.version,
        agentName: CONFIG.andreaaAiEmployee.agentName,
        role: CONFIG.andreaaAiEmployee.role,
        posture: CONFIG.andreaaAiEmployee.posture,
        learningMode: CONFIG.andreaaAiEmployee.learningMode,
        abilities: CONFIG.andreaaAiEmployee.abilities,
        commandExecutor: CONFIG.andreaaAiEmployee.commandExecutor,
        signalTransmitter: CONFIG.andreaaAiEmployee.signalTransmitter,
        irsFormsGeneration: CONFIG.andreaaAiEmployee.irsFormsGeneration
    },
    authentication: {
        version: CONFIG.tokenAuthentication.version,
        sequenceName: CONFIG.tokenAuthentication.sequenceName,
        credentialPosture: CONFIG.tokenAuthentication.credentialPosture,
        serviceAccount: CONFIG.tokenAuthentication.serviceAccount,
        handshake: CONFIG.tokenAuthentication.handshake,
        roles: CONFIG.tokenAuthentication.roles,
        defaultDeny: CONFIG.tokenAuthentication.defaultDeny,
        tokenStoragePolicy: CONFIG.tokenAuthentication.tokenStoragePolicy
    },
    security: {
        version: CONFIG.securityPolicies.version,
        credentialPosture: CONFIG.securityPolicies.credentialPosture,
        prohibitedSecretClasses: CONFIG.securityPolicies.prohibitedSecretClasses,
        operatorRoles: CONFIG.securityPolicies.operatorRoles,
        accessScope: CONFIG.securityPolicies.accessScope,
        guardrails: CONFIG.securityPolicies.guardrails
    },
    reconciliation: {
        version: CONFIG.reconciliationPolicies.version,
        posture: CONFIG.reconciliationPolicies.posture,
        safeguards: CONFIG.reconciliationPolicies.safeguards,
        validationHandshake: CONFIG.reconciliationPolicies.validationHandshake,
        freezeCodes: CONFIG.reconciliationPolicies.freezeRemedies.map((remedy) => remedy.code),
        noticeInterventions: CONFIG.reconciliationPolicies.noticeInterventions.map((intervention) => intervention.notice),
        ledgers: CONFIG.reconciliationPolicies.reconciliationLedgers,
        eroSignalRemovalStagingEnabled: CONFIG.reconciliationPolicies.eroSignalRemoval.enabledForStaging
    },
    authorizations: {
        aca: {
            trackingNumber: CONFIG.esamAuthorizations.acaTccApplication.trackingNumber,
            status: CONFIG.esamAuthorizations.acaTccApplication.applicationStatus,
            activeTccs: CONFIG.esamAuthorizations.acaTccApplication.tccs
                .filter((record) => record.status === "Active")
                .map((record) => ({ role: record.role, tcc: record.tcc, indicator: record.indicator }))
        },
        iris: {
            trackingNumber: CONFIG.esamAuthorizations.irisTccApplication.trackingNumber,
            status: CONFIG.esamAuthorizations.irisTccApplication.applicationStatus,
            activeTccs: CONFIG.esamAuthorizations.irisTccApplication.tccs
                .filter((record) => record.status === "Active")
                .map((record) => ({ role: record.role, tcc: record.tcc, method: record.method, indicator: record.indicator }))
        },
        efile: {
            trackingNumber: CONFIG.esamAuthorizations.efileApplication.trackingNumber,
            status: CONFIG.esamAuthorizations.efileApplication.applicationStatus,
            efin: CONFIG.esamAuthorizations.efileApplication.efin,
            activeEtins: CONFIG.esamAuthorizations.efileApplication.etins
                .filter((record) => record.status === "Active")
                .map((record) => ({ id: record.id, type: record.type, providerOption: record.providerOption }))
        }
    }
};
const signature = generateHmacSignature(JSON.stringify(trackingEnvelope), CONFIG.hmacSecret);
dispatchPipelineTransaction('bull:254TaxProPipeline:wait', { jobId: crypto.randomUUID(), data: trackingEnvelope, signature });



function createApiPayload(pathname) {
    if (pathname === "/health") {
        return { status: "ok", source: "rtpsc-live-feed-api", timestamp: new Date().toISOString() };
    }

    if (pathname === "/live-feed") {
        return CONFIG.liveFeedInterface;
    }

    if (pathname === "/jobs") {
        return { jobs: CONFIG.liveFeedInterface.jobDatasets, phraser: CONFIG.liveFeedInterface.automatedPhraser };
    }

    if (pathname === "/transmittal") {
        return CONFIG.transmittalMachineInterface;
    }

    if (pathname === "/workspace") {
        return CONFIG.taxOfficeWorkspace;
    }

    if (pathname === "/compliance") {
        return CONFIG.eroComplianceGates;
    }

    if (pathname === "/accounts") {
        return CONFIG.accountOnboarding;
    }

    if (pathname === "/services") {
        return CONFIG.serviceCatalog;
    }

    if (pathname === "/rosssign") {
        return CONFIG.rossSignEsignature;
    }

    if (pathname === "/windows-shell") {
        return CONFIG.windowsApplicationShell;
    }

    if (pathname === "/forms-cabinet") {
        return CONFIG.formsCabinet;
    }

    if (pathname === "/billing") {
        return CONFIG.billingReconciliation;
    }

    if (pathname === "/brand") {
        return CONFIG.brandAssets;
    }

    if (pathname === "/self-healing") {
        return CONFIG.selfHealingWorker;
    }

    if (pathname === "/aws-deployment") {
        return CONFIG.awsDeployment;
    }

    if (pathname === "/next-dashboard") {
        return CONFIG.nextDashboardModules;
    }

    if (pathname === "/auth") {
        return CONFIG.tokenAuthentication;
    }

    if (pathname === "/assistant") {
        return CONFIG.andreaaAiEmployee;
    }

    if (pathname === "/legal") {
        return CONFIG.legalNotices;
    }

    if (pathname === "/safeguards") {
        return {
            security: CONFIG.securityPolicies,
            reconciliation: CONFIG.reconciliationPolicies.safeguards,
            transmittal: CONFIG.transmittalMachineInterface.safeguards,
            authentication: CONFIG.tokenAuthentication.tokenStoragePolicy,
            compliance: CONFIG.eroComplianceGates.releaseRule,
            accounts: CONFIG.accountOnboarding.overridePinPolicy,
            killSwitches: CONFIG.transmittalMachineInterface.killSwitches
        };
    }

    return { error: "not_found", supportedEndpoints: CONFIG.liveFeedInterface.apiServer.endpoints };
}

function startLiveFeedApiServer() {
    if (!CONFIG.liveFeedApiEnabled) {
        console.log("[LIVE_FEED_API] Disabled. Set ENABLE_LIVE_FEED_API=true to start the API server.");
        return;
    }

    const apiServer = http.createServer((request, response) => {
        const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
        const payload = createApiPayload(requestUrl.pathname);
        const statusCode = payload.error === "not_found" ? 404 : 200;

        response.writeHead(statusCode, { "Content-Type": "application/json" });
        response.end(JSON.stringify(payload, null, 2));
    });

    apiServer.listen(CONFIG.apiPort, () => {
        console.log(`[LIVE_FEED_API] Listening on port ${CONFIG.apiPort}.`);
    });
}

startLiveFeedApiServer();
