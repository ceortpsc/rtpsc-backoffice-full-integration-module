-- Digital signature capture and audit trail
CREATE TABLE IF NOT EXISTS signature_events (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    signer_name VARCHAR(255) NOT NULL,
    signature_hash VARCHAR(128) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location_text VARCHAR(255)
);
