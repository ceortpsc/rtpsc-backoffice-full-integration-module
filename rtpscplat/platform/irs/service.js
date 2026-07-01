const { getEnvConfig } = require('../auth/env-config');

function buildIrsTaxProIntegration(input = {}) {
  const config = getEnvConfig();
  const taxpayerName = input.taxpayerName || 'Taxpayer';
  const taxpayerId = input.taxpayerId || 'TBD';
  const serviceType = input.serviceType || 'TDS Request';
  const forms = input.forms || ['Form 8821', 'Form 2848'];
  const signatureType = input.signatureType || 'Wet Signature';
  const cafSubmitted = Boolean(input.cafSubmitted);

  return {
    provider: 'IRS TaxPro',
    environment: config.sbtpg.environment,
    syncMode: config.sbtpg.syncMode,
    credentials: {
      username: config.sbtpg.username,
      email: config.sbtpg.creditialEmail,
      adminEmail: config.sbtpg.creditialAdminEmail
    },
    taxpayerName,
    taxpayerId,
    serviceType,
    forms,
    signatureType,
    cafSubmitted,
    status: cafSubmitted ? 'CAF SUBMITTED' : 'READY FOR SUBMISSION',
    capabilities: ['Authentication', 'Submission Routing', 'Compliance Sync', 'Notification Hooks', 'CAF Faxing'],
    workflow: [
      'Pull active authorization and forms',
      'Execute wet-signature packet',
      'Queue IRS CAF transmission',
      'Store compliant copy and audit trail'
    ],
    nextAction: cafSubmitted ? 'Monitor IRS processing status' : 'Submit to CAF unit'
  };
}

function buildIrsApiPayload(payload = {}) {
  return {
    taxpayerId: payload.taxpayerId || 'TBD',
    serviceType: payload.serviceType || 'Return Preparation',
    amount: Number(payload.amount || 0),
    status: 'READY',
    source: 'ROSS TAX PRO'
  };
}

function buildIrsFormPacket(input = {}) {
  const forms = input.forms || ['Form 8821', 'Form 2848'];
  return {
    forms,
    title: 'IRS Form Packet',
    readyForFax: true,
    signatureMode: input.signatureType || 'Wet Signature',
    instructions: 'Print, execute, sign, and fax to the IRS CAF unit for processing.'
  };
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function buildTransmissionValidationBundle(input = {}) {
  const taxpayerName = input.taxpayerName || 'Taxpayer';
  const taxpayerId = input.taxpayerId || 'TBD';
  const taxYear = input.taxYear || new Date().getUTCFullYear();
  const ssnLast4 = String(input.ssnLast4 || '').trim();
  const sscPresent = toBoolean(input.sscPresent);
  const eroEfin = String(input.eroEfin || '').trim();
  const eroName = input.eroName || 'ERO';
  const practitionerPin = String(input.practitionerPin || '').trim();
  const practitionerPtin = String(input.practitionerPtin || '').trim().toUpperCase();
  const consentSigned = toBoolean(input.consentSigned);
  const identityVerified = toBoolean(input.identityVerified);
  const attachments = Array.isArray(input.attachments) ? input.attachments : [];

  const seededPreparerNotes = [
    'Transmission explanation seeded for taxpayer interview artifacts and e-file gate review.',
    'Identity verification must pass before IRS transmission release is enabled.',
    'Retention packet must include signed consent, identity evidence, and preparer workpapers.'
  ];
  const preparerNotes = Array.isArray(input.preparerNotes) && input.preparerNotes.length > 0
    ? [...seededPreparerNotes, ...input.preparerNotes]
    : seededPreparerNotes;

  const requiredAttachments = ['signed-8879', 'government-id', 'consent-form', 'retention-certification'];
  const missingAttachments = requiredAttachments.filter((name) => !attachments.includes(name));

  const checks = {
    taxpayerIdentity: {
      taxpayerName,
      taxpayerId,
      ssnLast4Present: ssnLast4.length === 4,
      sscPresent,
      identityVerified
    },
    eroIdentity: {
      eroName,
      eroEfin,
      efinValid: /^\d{6}$/.test(eroEfin)
    },
    practitioner: {
      practitionerPin,
      practitionerPtin,
      pinValid: /^\d{5}$/.test(practitionerPin),
      ptinValid: /^P\d{8}$/.test(practitionerPtin)
    },
    consent: {
      consentSigned,
      form: 'Taxpayer Consent and Disclosure Acknowledgment'
    },
    retention: {
      requiredAttachments,
      submittedAttachments: attachments,
      missingAttachments
    }
  };

  const blockers = [];
  if (!checks.taxpayerIdentity.ssnLast4Present) blockers.push('Taxpayer SSN last four is required.');
  if (!checks.taxpayerIdentity.sscPresent) blockers.push('Taxpayer SSC presence confirmation is required.');
  if (!checks.taxpayerIdentity.identityVerified) blockers.push('Identity verification has not been completed.');
  if (!checks.eroIdentity.efinValid) blockers.push('ERO EFIN must be a 6-digit value.');
  if (!checks.practitioner.pinValid) blockers.push('Tax practitioner PIN must be 5 digits.');
  if (!checks.practitioner.ptinValid) blockers.push('Tax practitioner PTIN must follow P######## format.');
  if (!checks.consent.consentSigned) blockers.push('Taxpayer consent must be signed before transmission.');
  if (missingAttachments.length > 0) blockers.push(`Missing retention attachments: ${missingAttachments.join(', ')}`);

  const balanceCertification = {
    debitTotal: Number(input.debitTotal || 0),
    creditTotal: Number(input.creditTotal || 0)
  };
  balanceCertification.balance = Number((balanceCertification.debitTotal - balanceCertification.creditTotal).toFixed(2));
  balanceCertification.status = balanceCertification.balance === 0 ? 'CERTIFIED' : 'OUT OF BALANCE';

  const certificationTranscript = [
    `Taxpayer ${taxpayerName} (${taxpayerId}) transcript generated for TY${taxYear}.`,
    `ERO validation ${checks.eroIdentity.efinValid ? 'passed' : 'failed'} for ${eroName}.`,
    `Practitioner credential gate ${checks.practitioner.pinValid && checks.practitioner.ptinValid ? 'passed' : 'failed'}.`,
    `Retention packet ${missingAttachments.length === 0 ? 'complete' : 'incomplete'} for archive certification.`
  ];

  const form4883C = {
    title: 'IRS Identity Verification Letter 4883C',
    taxpayerName,
    taxpayerId,
    identityVerified,
    preventionSteps: [
      'Verify government ID and taxpayer SSC record before e-file release.',
      'Require signed consent and authenticated practitioner PTIN/PIN.',
      'Reject transmission when retention attachments are incomplete.',
      'Record certification transcript and compliance ledger snapshot.'
    ]
  };

  const xml4883C = `<?xml version="1.0" encoding="UTF-8"?>\n<IdentityVerification4883C>\n  <TaxYear>${taxYear}</TaxYear>\n  <TaxpayerName>${taxpayerName}</TaxpayerName>\n  <TaxpayerId>${taxpayerId}</TaxpayerId>\n  <IdentityVerified>${identityVerified}</IdentityVerified>\n  <EROEFIN>${eroEfin}</EROEFIN>\n  <PractitionerPTIN>${practitionerPtin}</PractitionerPTIN>\n  <ConsentSigned>${consentSigned}</ConsentSigned>\n  <ReturnValidation>${blockers.length === 0 ? 'PASSED' : 'FAILED'}</ReturnValidation>\n</IdentityVerification4883C>`;

  return {
    transmissionStatus: blockers.length === 0 ? 'VALIDATED' : 'BLOCKED',
    returnValidation: blockers.length === 0 ? 'PASSED' : 'FAILED',
    efileReady: blockers.length === 0,
    preparerNotes,
    explanations: [
      'Transmission package includes seeded compliance narratives and identity checks.',
      'Ledger balance certification and transcript are attached for review evidence.',
      'XML conversion for IRS 4883C identity verification is generated for export.'
    ],
    checks,
    complianceLedger: {
      ledgerId: input.ledgerId || `compliance-ledger-${Date.now()}`,
      entries: [
        { label: 'Identity Verification', status: checks.taxpayerIdentity.identityVerified ? 'PASS' : 'FAIL' },
        { label: 'ERO Validation', status: checks.eroIdentity.efinValid ? 'PASS' : 'FAIL' },
        { label: 'Consent Validation', status: checks.consent.consentSigned ? 'PASS' : 'FAIL' },
        { label: 'Retention Attachment Validation', status: missingAttachments.length === 0 ? 'PASS' : 'FAIL' }
      ],
      balanceCertification,
      certificationTranscript
    },
    retentionCertification: {
      options: ['digital-archive', 'paper-archive', 'hybrid-archive'],
      selected: input.retentionMode || 'digital-archive',
      requirements: requiredAttachments,
      missingAttachments,
      compliant: missingAttachments.length === 0
    },
    form4883C,
    conversion: {
      format: 'application/xml',
      fileName: `identity-verification-4883c-${taxpayerId}.xml`,
      xml: xml4883C
    },
    blockers,
    preventionSteps: form4883C.preventionSteps
  };
}

module.exports = {
  buildIrsTaxProIntegration,
  buildIrsApiPayload,
  buildIrsFormPacket,
  buildTransmissionValidationBundle
};
