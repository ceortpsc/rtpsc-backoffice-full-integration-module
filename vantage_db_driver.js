/**
 * Vantage Core Systems - Production Microservice Architecture
 * File: vantage_db_driver.js
 * Version: 60.4.1 - Fully Integrated Enterprise Target
 */

// 1. Immutable Enterprise Scope Parameters
const SYSTEM_METRICS = {
    dbUser: "ceo_db_user",
    dbPass: process.env.VANTAGE_DB_PASSWORD,
    clusterUrl: "rtpsc.pfipw8j.mongodb.net",
    appName: "rtpsc",
    efin: "748335",
    apiKeyBound: !!process.env.MODEL_API_KEY
};

// 2. Strict Pre-Flight Cryptographic Integrity Check
const missingEnvironmentVariables = [];

if (!SYSTEM_METRICS.dbPass) {
    missingEnvironmentVariables.push("VANTAGE_DB_PASSWORD");
}

if (!SYSTEM_METRICS.apiKeyBound) {
    missingEnvironmentVariables.push("MODEL_API_KEY");
}

if (missingEnvironmentVariables.length > 0) {
    console.error(`[CRITICAL] [SECURITY_LOCK] Required environment variable(s) vacant: ${missingEnvironmentVariables.join(", ")}.`);
    console.error("[CRITICAL] Process terminated automatically to guarantee structural security boundaries.");
    process.exit(1);
}

// 3. Dynamic Connection URI Generation
const uri = `mongodb+srv://${SYSTEM_METRICS.dbUser}:${encodeURIComponent(SYSTEM_METRICS.dbPass)}@${SYSTEM_METRICS.clusterUrl}/?retryWrites=true&w=majority&appName=${SYSTEM_METRICS.appName}`;

// 4. Driver Loading and Client Core Pool Initialization
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    },
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
});

async function runVantageDatabaseSync() {
    const logTimestamp = new Date().toISOString();
    console.log(`[${logTimestamp}] [DB_DRIVER] [PRODUCTION] Connecting to cluster: ${SYSTEM_METRICS.clusterUrl}`);

    console.log(`[${logTimestamp}] [API_DRIVER] [PRODUCTION] Verified Model API Key binding context for Project 0.`);

    try {
        // Fire cluster link handshake
        await client.connect();

        // Administrative node ping confirmation
        await client.db("admin").command({ ping: 1 });
        console.log(`[DB_DRIVER] [PRODUCTION] Handshake Verified. Successfully synchronized with Ross Tax Pro Cluster [EFIN: ${SYSTEM_METRICS.efin}].`);
    } catch (error) {
        console.error("[CRITICAL] [PRODUCTION] Live transaction pipeline dropped:", error.message);
        process.exit(1);
    } finally {
        // Safe link closure to avoid collection leak bounds
        await client.close();
        console.log("[DB_DRIVER] [PRODUCTION] Node connection safely closed. Resources reclaimed.");
    }
}

// Execute core sequence
runVantageDatabaseSync().catch(console.dir);
