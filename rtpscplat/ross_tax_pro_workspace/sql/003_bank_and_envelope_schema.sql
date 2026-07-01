-- Bank product, envelope, and signature-bearing artifacts
CREATE TABLE IF NOT EXISTS bank_products (
    id UUID PRIMARY KEY,
    product_code VARCHAR(64) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS envelopes (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    envelope_id VARCHAR(64) NOT NULL UNIQUE,
    timestamp_utc TIMESTAMPTZ NOT NULL,
    location_text VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
