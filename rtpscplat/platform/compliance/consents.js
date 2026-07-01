function buildTaxpayerConsentBundle(input = {}) {
  const taxpayerName = input.taxpayerName || '';
  const taxpayerId = input.taxpayerId || '';
  const email = input.email || '';
  const serviceType = input.serviceType || '';
  const consentDate = input.consentDate || '';

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Taxpayer Consent and Acknowledgment Packet</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 800px; margin: 24px auto; color: #111827; line-height: 1.6; }
      h1, h2 { color: #0f4c81; }
      .box { border: 1px solid #d1d5db; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    </style>
  </head>
  <body>
    <h1>Taxpayer Consent and Acknowledgment Packet</h1>
    <div class="box">
      <p><strong>Taxpayer:</strong> ${taxpayerName}</p>
      <p><strong>Taxpayer ID:</strong> ${taxpayerId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service Type:</strong> ${serviceType}</p>
      <p><strong>Date:</strong> ${consentDate}</p>
    </div>
    <div class="box">
      <h2>Consent</h2>
      <p>I acknowledge that my information may be used for return preparation, document review, secure storage, e-file preparation, and compliance monitoring in accordance with the platform policies and applicable law.</p>
    </div>
    <div class="box">
      <h2>Acknowledgment</h2>
      <p>I acknowledge that ROSS TAX PRO may retain records for required retention periods and may refuse or deny services where policy, identity, or compliance safeguards are not satisfied.</p>
    </div>
    <div class="box">
      <h2>Agreement</h2>
      <p>I agree to provide complete and accurate information, support identity verification, and review all generated documents prior to submission or export.</p>
    </div>
  </body>
</html>`;

  const text = [
    'Taxpayer Consent and Acknowledgment Packet',
    `Taxpayer: ${taxpayerName}`,
    `Taxpayer ID: ${taxpayerId}`,
    `Email: ${email}`,
    `Service Type: ${serviceType}`,
    `Date: ${consentDate}`,
    'Consent: I acknowledge that my information may be used for return preparation, document review, secure storage, e-file preparation, and compliance monitoring in accordance with the platform policies and applicable law.',
    'Acknowledgment: I acknowledge that ROSS TAX PRO may retain records for required retention periods and may refuse or deny services where policy, identity, or compliance safeguards are not satisfied.',
    'Agreement: I agree to provide complete and accurate information, support identity verification, and review all generated documents prior to submission or export.'
  ].join('\n');

  return {
    html,
    text,
    filename: `consent-${taxpayerId.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'taxpayer'}.html`,
    savedAt: consentDate
  };
}

module.exports = {
  buildTaxpayerConsentBundle
};
