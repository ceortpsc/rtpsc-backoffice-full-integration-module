-- Core client and return management
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY,
    office_id UUID NOT NULL,
    client_id_number VARCHAR(32) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_returns (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id),
    tax_year INTEGER NOT NULL,
    program_used VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
