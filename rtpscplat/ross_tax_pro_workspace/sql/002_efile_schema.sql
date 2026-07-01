-- IRS e-file and transmission controls
CREATE TABLE IF NOT EXISTS transmissions (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    office_id UUID NOT NULL,
    channel VARCHAR(32) NOT NULL DEFAULT 'MEF',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    irs_submission_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reject_codes (
    code VARCHAR(32) PRIMARY KEY,
    description TEXT NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'ERROR'
);
