CREATE TABLE IF NOT EXISTS offices (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    parent_office_id TEXT REFERENCES offices(id),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO offices (id, code, name)
VALUES ('office-254-kil-ero', '254-KIL-ERO', 'ROSS TAX PRO - KILLEEN ERO');
