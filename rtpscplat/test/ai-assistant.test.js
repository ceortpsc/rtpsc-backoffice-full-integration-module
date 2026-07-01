const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildIntakeRecommendations,
  buildEnrollmentQuestionnaire,
  buildInterviewWizard,
  buildPreparerNotes,
  generateManualForms,
  searchBankProducts,
  scoreRisk,
  scanDocuments
} = require('../platform/ai/engine');

test('buildIntakeRecommendations proposes relevant forms and credits', () => {
  const result = buildIntakeRecommendations({
    filingStatus: 'single',
    grossIncome: 98000,
    selfEmployedIncome: 42000,
    educationExpenses: 3200,
    childcareExpenses: 1800,
    energyImprovementCost: 3000,
    children: 1
  });

  assert.match(result.forms.join(' '), /1040/);
  assert.match(result.forms.join(' '), /Schedule C/);
  assert.match(result.forms.join(' '), /8863/);
  assert.match(result.forms.join(' '), /2441/);
  assert.ok(result.credits.some((credit) => credit.code === 'EDUCATION_CREDIT'));
});

test('buildPreparerNotes adds IRM and IRC citations', () => {
  const notes = buildPreparerNotes({ filingStatus: 'single', selfEmployedIncome: 42000 });
  assert.ok(notes.some((note) => note.citation.includes('IRM')));
  assert.ok(notes.some((note) => note.citation.includes('IRC')));
});

test('scoreRisk and scanDocuments return actionable guidance', () => {
  const risk = scoreRisk({ grossIncome: 180000, missingDocuments: true, foreignAddress: true, priorYearAdjustment: true });
  assert.ok(risk.score >= 70);
  const scan = scanDocuments([{ name: 'w2-001.pdf' }, { name: '1099-int.pdf' }, { name: 'signed-8879.pdf' }]);
  assert.ok(scan.findings.some((finding) => finding.type === 'SIGNATURE_READY'));
});

test('buildEnrollmentQuestionnaire and buildInterviewWizard provide advanced federal/state interview flow', () => {
  const profile = {
    filingStatus: 'married',
    state: 'CA',
    grossIncome: 142000,
    selfEmployedIncome: 40000,
    educationExpenses: 3000,
    childcareExpenses: 2500,
    interestIncome: 800,
    children: 2
  };

  const questionnaire = buildEnrollmentQuestionnaire(profile);
  const wizard = buildInterviewWizard(profile);

  assert.equal(questionnaire.enrollmentStatus, 'READY');
  assert.ok(questionnaire.sections.length >= 3);
  assert.ok(wizard.recommendedForms.includes('1040'));
  assert.ok(wizard.recommendedForms.includes('CA Form 540'));
  assert.equal(wizard.generationPlan.optionalManualGeneration, true);
});

test('generateManualForms and searchBankProducts support optional form generation and bank product discovery', () => {
  const forms = generateManualForms({ forms: ['1040', 'Schedule C'] });
  const bankResults = searchBankProducts({ query: 'advance' });

  assert.equal(forms.mode, 'MANUAL_OPTIONAL');
  assert.equal(forms.generatedForms.length, 2);
  assert.ok(bankResults.total >= 1);
  assert.ok(bankResults.products.some((product) => product.name.toLowerCase().includes('advance')));
});
