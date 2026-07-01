const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Resolve paths relative to working workspace parameters
const DB_FILE = path.join(__dirname, '..', '..', 'ross_tax_pro.db');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

console.log(`[*] Vantage Migration Engine initializing...`);
console.log(`[*] Target Database Core File: ${DB_FILE}`);

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error(`[-] Database connection error: ${err.message}`);
        process.exit(1);
    }
});

// Primary migration execution sequencer
function runMigrations() {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.error(`[-] Migration source folder missing at: ${MIGRATIONS_DIR}`);
        db.close();
        return;
    }

    // Read all files inside target deployment folder and sort sequentially
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith('.sql'))
        .sort();

    if (files.length === 0) {
        console.log(`[!] No .sql migration blocks found inside ${MIGRATIONS_DIR}. Standby for data schema input.`);
        db.close();
        return;
    }

    console.log(`[*] Found ${files.length} structured migration files. Initializing injection sequence...`);

    db.serialize(() => {
        // Enforce transaction safety wrapper
        db.run("BEGIN TRANSACTION;");

        try {
            files.forEach((file) => {
                const filePath = path.join(MIGRATIONS_DIR, file);
                console.log(`  [→] Executing Module: ${file}`);
                
                const sqlContent = fs.readFileSync(filePath, 'utf-8');
                
                // Execute raw multi-line schema injections
                db.exec(sqlContent, (err) => {
                    if (err) {
                        console.error(`  [-] Execution failed on file ${file}: ${err.message}`);
                        throw err;
                    }
                });
            });

            db.run("COMMIT;", (err) => {
                if (err) {
                    console.error(`[-] Transaction commit rejected: ${err.message}`);
                } else {
                    console.log(`\n[!] TRANSACTION SUCCESSFUL: All schema layers injected smoothly.`);
                }
                db.close();
            });

        } catch (error) {
            console.error(`\n[!!!] CRITICAL FAILURE: Rolling back database execution sequence.`);
            db.run("ROLLBACK;");
            db.close();
            process.exit(1);
        }
    });
}

runMigrations();
