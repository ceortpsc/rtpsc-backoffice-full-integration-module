const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG = {
    redisHost: '127.0.0.1',
    redisPort: 6379,
    exportDirectory: 'C:\\TaxProExports',
    hmacSecret: 'CRITICAL_INFRASTRUCTURE_KEY_CHANGE_PROD_ONLY',
    reconnectInterval: 5000,
    irsProfile: {
        legalName: "ROSS TAX PREP AND BOOKKEEPING",
        dbaName: "254-tax consultants",
        ein: "33-4891499",
        trackingNumber: "20260213013816217026",
        clientId: "1280a487-33b6-4959-afb9-f1dd5c70fcc5",
        apiLabel: "rosstax_app_api",
        modules: ["SOR", "TDS", "TINM", "IRIS"],
        address: "2509 COY POE RD UNIT B, KILLEEN, TX 76549",
        principal: "Condre D Ross",
        email: "condrer@outlook.com"
    }
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

const trackingEnvelope = { meta: { source: "IRS_ESAM_TUNNEL", timestamp: new Date().toISOString() }, firm: { legalName: CONFIG.irsProfile.legalName } };
const signature = generateHmacSignature(JSON.stringify(trackingEnvelope), CONFIG.hmacSecret);
dispatchPipelineTransaction('bull:254TaxProPipeline:wait', { jobId: crypto.randomUUID(), data: trackingEnvelope, signature });

