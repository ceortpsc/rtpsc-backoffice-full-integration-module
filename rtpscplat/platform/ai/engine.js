function buildIntakeRecommendations(profile) {
  const forms = [];
  const credits = [];
  const notes = [];
  const calculations = [];

  forms.push('1040');
  if (profile.selfEmployedIncome > 0) forms.push('Schedule C');
  if (profile.educationExpenses > 0) forms.push('8863');
  if (profile.childcareExpenses > 0) forms.push('2441');
  if (profile.energyImprovementCost > 0) forms.push('5695');
  if (profile.grossIncome > 100000) forms.push('Schedule SE');

  if (profile.educationExpenses > 0) credits.push({ code: 'EDUCATION_CREDIT', label: 'Education credit' });
  if (profile.childcareExpenses > 0) credits.push({ code: 'CHILD_CARE_CREDIT', label: 'Child care credit' });
  if (profile.energyImprovementCost > 0) credits.push({ code: 'ENERGY_CREDIT', label: 'Energy efficiency credit' });
  if (profile.children > 0) credits.push({ code: 'CHILD_TAX_CREDIT', label: 'Child tax credit' });

  const estimatedTaxBreak = Math.round((profile.educationExpenses || 0) * 0.2 + (profile.childcareExpenses || 0) * 0.2 + (profile.energyImprovementCost || 0) * 0.1);
  calculations.push({ label: 'Estimated tax break', amount: estimatedTaxBreak });

  if (profile.selfEmployedIncome > 0) {
    notes.push({ text: 'Review self-employment tax and deductible business expense support.', citation: 'IRM 4.10.8 / IRC §1401' });
  }
  if (profile.educationExpenses > 0) {
    notes.push({ text: 'Confirm education expense eligibility and supporting tuition statements.', citation: 'IRM 4.19.2 / IRC §25A' });
  }
  if (profile.childcareExpenses > 0) {
    notes.push({ text: 'Validate child care provider details and taxpayer identification.', citation: 'IRM 4.23.5 / IRC §21' });
  }
  if (profile.energyImprovementCost > 0) {
    notes.push({ text: 'Confirm residential energy credit documentation and product eligibility.', citation: 'IRM 4.26.7 / IRC §25D' });
  }

  return {
    forms: [...new Set(forms)],
    credits,
    notes,
    calculations,
    nextAction: 'Gather supporting documents and confirm calculations before submission.'
  };
}

function buildEnrollmentQuestionnaire(profile) {
  const normalized = {
    filingStatus: profile.filingStatus || 'single',
    state: profile.state || 'TX',
    dependents: Number(profile.children || 0),
    hasSelfEmployment: Number(profile.selfEmployedIncome || 0) > 0,
    hasEducationExpenses: Number(profile.educationExpenses || 0) > 0,
    hasChildcareExpenses: Number(profile.childcareExpenses || 0) > 0,
    hasEnergyCredit: Number(profile.energyImprovementCost || 0) > 0,
    hasInterestIncome: Number(profile.interestIncome || 0) > 0,
    hasRetirementDistribution: Number(profile.retirementDistribution || 0) > 0
  };

  return {
    enrollmentStatus: 'READY',
    profile: normalized,
    sections: [
      {
        id: 'identity',
        title: 'Identity and Filing Setup',
        questions: [
          'Confirm taxpayer legal name, SSN/ITIN, and date of birth.',
          'Select filing status and residency details for federal and state returns.',
          'Confirm direct deposit and disbursement preferences.'
        ]
      },
      {
        id: 'income',
        title: 'Income Sources',
        questions: [
          'List W-2, 1099, K-1, and self-employment income streams.',
          'Confirm retirement, unemployment, and investment distributions.',
          'Validate withholding amounts from all submitted statements.'
        ]
      },
      {
        id: 'credits-deductions',
        title: 'Credits and Deductions',
        questions: [
          'Confirm dependent eligibility and support tests.',
          'Capture qualifying education, childcare, and home energy expenses.',
          'Review itemized deduction support for federal and state treatment.'
        ]
      }
    ],
    nextAction: 'Complete interview wizard for federal/state form population and generation.'
  };
}

function buildInterviewWizard(profile) {
  const recommendations = buildIntakeRecommendations(profile);
  const stateCode = (profile.state || 'TX').toUpperCase();
  const stateFormMap = {
    CA: ['CA Form 540'],
    NY: ['IT-201'],
    NJ: ['NJ-1040'],
    IL: ['IL-1040'],
    TX: ['No individual income tax return']
  };

  const federalQuestions = [
    'Did the taxpayer receive any additional 1099 income not yet uploaded?',
    'Were advance credits or estimated tax payments made during the tax year?',
    'Does the taxpayer need direct deposit split across multiple accounts?'
  ];

  const stateQuestions = [
    `Confirm ${stateCode} resident, part-year resident, or nonresident status.`,
    'List state-specific adjustments, credits, and local tax obligations.',
    'Confirm state estimated payments and carryforward balances.'
  ];

  const formPopulation = [
    { form: '1040', populatedFields: ['taxpayerIdentity', 'filingStatus', 'incomeSummary', 'creditsSummary'] },
    { form: 'Schedule 1', populatedFields: ['additionalIncome', 'adjustmentsToIncome'] },
    { form: 'Schedule 2', populatedFields: ['selfEmploymentTax', 'additionalTax'] },
    { form: 'Schedule 3', populatedFields: ['nonrefundableCredits'] }
  ];

  const stateForms = stateFormMap[stateCode] || ['State individual return'];
  if (stateForms[0] !== 'No individual income tax return') {
    formPopulation.push({ form: stateForms[0], populatedFields: ['stateIncome', 'stateAdjustments', 'stateCredits'] });
  }

  const accuracyChecks = [
    'Cross-check dependent SSNs against enrollment records.',
    'Reconcile withholding totals with W-2 and 1099 submissions.',
    'Validate federal/state AGI bridge and refund transfer election.',
    'Require manual review when risk score band is HIGH.'
  ];

  return {
    wizardStatus: 'READY',
    federalQuestions,
    stateQuestions,
    recommendedForms: [...new Set([...recommendations.forms, ...stateForms])],
    formPopulation,
    accuracyChecks,
    generationPlan: {
      automated: true,
      optionalManualGeneration: true,
      output: ['federalPacket', 'statePacket', 'signaturePacket', 'bankProductPacket']
    }
  };
}

function generateManualForms(payload = {}) {
  const selectedForms = Array.isArray(payload.forms) && payload.forms.length > 0
    ? payload.forms
    : ['1040'];

  const generatedForms = selectedForms.map((formName) => ({
    form: formName,
    status: 'GENERATED',
    fieldsIncluded: ['taxpayerIdentity', 'incomeSummary', 'creditSummary', 'preparerReview'],
    generatedAt: new Date().toISOString()
  }));

  return {
    mode: 'MANUAL_OPTIONAL',
    generatedForms,
    message: 'Manual forms generated successfully for preparer review and override.'
  };
}

function searchBankProducts(payload = {}) {
  const query = (payload.query || '').toLowerCase().trim();
  const catalog = [
    {
      code: 'RT-SAME-DAY',
      name: 'Refund Transfer Same-Day Deposit',
      bank: 'ROSS Partner Bank',
      fee: 39.95,
      features: ['same-day funding', 'fee withholding', 'digital authorization']
    },
    {
      code: 'ADVANCE-FAST',
      name: 'Refund Advance Express',
      bank: 'ROSS Partner Bank',
      fee: 49.95,
      features: ['advance decisioning', 'same-day disbursement', 'mobile confirmation']
    },
    {
      code: 'PAY-BY-REFUND',
      name: 'Pay-by-Refund Fee Collect',
      bank: 'Tax Settlement Bank',
      fee: 29.95,
      features: ['fee netting', 'disclosure packet', 'multi-account routing']
    }
  ];

  const matches = query
    ? catalog.filter((item) =>
      item.code.toLowerCase().includes(query)
      || item.name.toLowerCase().includes(query)
      || item.bank.toLowerCase().includes(query)
      || item.features.some((feature) => feature.toLowerCase().includes(query)))
    : catalog;

  return {
    query,
    total: matches.length,
    products: matches,
    status: matches.length > 0 ? 'MATCHED' : 'NO_MATCH'
  };
}

function buildPreparerNotes(profile) {
  const notes = [];
  if (profile.selfEmployedIncome > 0) {
    notes.push({ text: 'Self-employment tax review recommended.', citation: 'IRM 4.10.8 / IRC §1401' });
  }
  if (profile.grossIncome > 100000) {
    notes.push({ text: 'High-income review for additional documentation.', citation: 'IRM 4.16.5 / IRC §6001' });
  }
  if (profile.filingStatus === 'married') {
    notes.push({ text: 'Married filing status should be validated for dependent and deduction treatment.', citation: 'IRM 4.21.3 / IRC §1' });
  }
  return notes;
}

function scoreRisk(profile) {
  let score = 10;
  if (profile.grossIncome > 100000) score += 20;
  if (profile.missingDocuments) score += 25;
  if (profile.foreignAddress) score += 20;
  if (profile.priorYearAdjustment) score += 15;
  if (profile.selfEmployedIncome > 0) score += 10;
  if (score > 100) score = 100;
  const band = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  return { score, band, recommendation: band === 'HIGH' ? 'Escalate for review and manual verification.' : 'Proceed with standard review.' };
}

function scanDocuments(documents) {
  const findings = [];
  const names = documents.map((doc) => (doc.name || '').toLowerCase());
  if (names.some((name) => name.includes('w2'))) findings.push({ type: 'W2_PRESENT', detail: 'W-2 document present.' });
  if (names.some((name) => name.includes('1099'))) findings.push({ type: '1099_PRESENT', detail: '1099 document present.' });
  if (names.some((name) => name.includes('8879'))) findings.push({ type: 'SIGNATURE_READY', detail: 'Signature-ready package detected.' });
  if (names.some((name) => name.includes('id'))) findings.push({ type: 'ID_PRESENT', detail: 'Identity document present.' });
  return { findings, status: findings.length > 0 ? 'READY' : 'MISSING_DOCUMENTS' };
}

module.exports = {
  buildIntakeRecommendations,
  buildEnrollmentQuestionnaire,
  buildInterviewWizard,
  buildPreparerNotes,
  generateManualForms,
  searchBankProducts,
  scoreRisk,
  scanDocuments
};
