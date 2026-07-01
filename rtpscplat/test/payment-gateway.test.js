const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPrefilePaymentGate, buildFinanceReconciliationTools } = require('../platform/finance/payment-gateway');

test('buildPrefilePaymentGate returns ready prefile invoice when agreements and consents are complete', () => {
    const result = buildPrefilePaymentGate({
        clientId: 'client-001',
        taxpayerName: 'Jane Client',
        bankProductCode: 'SBTPG-RT',
        bankProductName: 'Refund Transfer',
        preparationFee: 349,
        transmissionFee: 79,
        bankProductFee: 45,
        protectionFee: 99,
        convenienceFee: 15,
        taxRate: 8.25,
        serviceAgreementSigned: true,
        consentBundleSigned: true,
        bankDisclosureAccepted: true,
        chargeAuthorizationAccepted: true
    });

    assert.equal(result.paymentGateway.provider, 'SBTPG');
    assert.equal(result.paymentGateway.gatewayStatus, 'READY_TO_PREFILE');
    assert.equal(result.prefileInvoice.status, 'PREFILE_READY');
    assert.equal(result.blockedReasons.length, 0);
    assert.ok(result.prefileInvoice.total > 0);
});

test('buildPrefilePaymentGate blocks prefile execution when required agreements are missing', () => {
    const result = buildPrefilePaymentGate({
        clientId: 'client-001',
        taxpayerName: 'Jane Client',
        preparationFee: 349,
        serviceAgreementSigned: false,
        consentBundleSigned: false,
        bankDisclosureAccepted: false,
        chargeAuthorizationAccepted: false
    });

    assert.equal(result.paymentGateway.gatewayStatus, 'BLOCKED');
    assert.equal(result.prefileInvoice.status, 'HOLD');
    assert.ok(result.blockedReasons.length >= 4);
});

test('buildFinanceReconciliationTools returns reconciled status when settlement and deposits match', () => {
    const result = buildFinanceReconciliationTools({
        invoiceTotal: 500,
        settledAmount: 500,
        bankDepositAmount: 485,
        processingFees: 15
    });

    assert.equal(result.reconciliationStatus, 'RECONCILED');
    assert.equal(result.variance, 0);
});

test('buildFinanceReconciliationTools flags review-required when variance exists', () => {
    const result = buildFinanceReconciliationTools({
        invoiceTotal: 500,
        settledAmount: 490,
        bankDepositAmount: 470,
        processingFees: 10
    });

    assert.equal(result.reconciliationStatus, 'REVIEW_REQUIRED');
    assert.notEqual(result.variance, 0);
    assert.ok(result.recommendations.some((item) => /Investigate/.test(item)));
});
