async function runAiIntake() {
  const payload = {
    filingStatus: document.getElementById('filing-status')?.value || 'single',
    grossIncome: Number(document.getElementById('gross-income')?.value || 0),
    selfEmployedIncome: Number(document.getElementById('self-employed-income')?.value || 0),
    educationExpenses: Number(document.getElementById('education-expenses')?.value || 0),
    childcareExpenses: Number(document.getElementById('childcare-expenses')?.value || 0),
    energyImprovementCost: Number(document.getElementById('energy-improvement')?.value || 0),
    children: Number(document.getElementById('children')?.value || 0),
    missingDocuments: Boolean(document.getElementById('missing-docs')?.checked),
    foreignAddress: Boolean(document.getElementById('foreign-address')?.checked),
    priorYearAdjustment: Boolean(document.getElementById('prior-adjustment')?.checked)
  };

  const response = await fetch('/api/ai/intake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  const output = document.getElementById('ai-output');
  if (output) {
    output.innerHTML = `
      <h4>Suggested forms</h4>
      <p>${(result.forms || []).join(', ')}</p>
      <h4>Credits</h4>
      <ul>${(result.credits || []).map((credit) => `<li>${credit.code}: ${credit.label}</li>`).join('')}</ul>
      <h4>Notes</h4>
      <ul>${(result.notes || []).map((note) => `<li>${note.text} <strong>${note.citation}</strong></li>`).join('')}</ul>
      <h4>Projected tax break</h4>
      <p>${(result.calculations || []).map((calculation) => `${calculation.label}: $${calculation.amount}`).join(' | ')}</p>
      <p><strong>${result.nextAction}</strong></p>
    `;
  }
}

async function runSelfServiceReview() {
  const payload = {
    filingStatus: document.getElementById('filing-status')?.value || 'single',
    grossIncome: Number(document.getElementById('gross-income')?.value || 0),
    selfEmployedIncome: Number(document.getElementById('self-employed-income')?.value || 0),
    missingDocuments: Boolean(document.getElementById('missing-docs')?.checked),
    foreignAddress: Boolean(document.getElementById('foreign-address')?.checked),
    priorYearAdjustment: Boolean(document.getElementById('prior-adjustment')?.checked)
  };

  const [intake, notes, risk] = await Promise.all([
    fetch('/api/ai/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((response) => response.json()),
    fetch('/api/ai/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((response) => response.json()),
    fetch('/api/ai/risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((response) => response.json())
  ]);

  const output = document.getElementById('self-service-output');
  if (output) {
    output.innerHTML = `
      <h4>Safe review checklist</h4>
      <ul>
        <li>Tax year: ${document.getElementById('tax-year')?.value || '2024'}</li>
        <li>Program type: ${document.getElementById('program-type')?.value || 'individual'}</li>
        <li>Submission mode: ${document.getElementById('submission-mode')?.value || 'efile'}</li>
        <li>Prior-year import: ${document.getElementById('prior-year-import')?.checked ? 'Yes' : 'No'}</li>
        <li>Identity verification: ${document.getElementById('identity-verification')?.checked ? 'Yes' : 'No'}</li>
        <li>Signature package: ${document.getElementById('signature-ready')?.checked ? 'Yes' : 'No'}</li>
      </ul>
      <h4>Suggested forms</h4>
      <p>${(intake.forms || []).join(', ')}</p>
      <h4>Risk</h4>
      <p>${risk.score}/100 (${risk.band}) — ${risk.recommendation}</p>
      <h4>Preparer notes</h4>
      <ul>${(notes.notes || []).map((note) => `<li>${note.text} <strong>${note.citation}</strong></li>`).join('')}</ul>
    `;
  }
}

window.runAiIntake = runAiIntake;
window.runSelfServiceReview = runSelfServiceReview;
