const { getEnvConfig } = require('../auth/env-config');

function toAmount(value) {
    const numeric = Number(value || 0);
    return Number.isFinite(numeric) ? Number(numeric.toFixed(2)) : 0;
}

function normalizeAgreementStatus(input = {}) {
    return {
        serviceAgreementSigned: Boolean(input.serviceAgreementSigned),
        consentBundleSigned: Boolean(input.consentBundleSigned),
        bankDisclosureAccepted: Boolean(input.bankDisclosureAccepted),
        chargeAuthorizationAccepted: Boolean(input.chargeAuthorizationAccepted)
    };
}

function computeCharges(payload = {}) {
    const preparationFee = toAmount(payload.preparationFee || 0);
    const transmissionFee = toAmount(payload.transmissionFee || 0);
    const bankProductFee = toAmount(payload.bankProductFee || 0);
    const protectionFee = toAmount(payload.protectionFee || 0);
    const convenienceFee = toAmount(payload.convenienceFee || 0);

    const items = [
        { code: 'PREP_FEE', label: 'Return Preparation Fee', amount: preparationFee },
        { code: 'TRANSMISSION_FEE', label: 'E-File Transmission Fee', amount: transmissionFee },
        { code: 'BANK_PRODUCT_FEE', label: 'SBTPG Bank Product Fee', amount: bankProductFee },
        { code: 'AUDIT_PROTECTION_FEE', label: 'Audit Protection Add-On', amount: protectionFee },
        { code: 'CONVENIENCE_FEE', label: 'Payment Convenience Fee', amount: convenienceFee }
    ].filter((item) => item.amount > 0);

    const subtotal = toAmount(items.reduce((sum, item) => sum + item.amount, 0));
    return {
        items,
        subtotal
    };
}

function buildPrefilePaymentGate(payload = {}) {
    const config = getEnvConfig();
    const agreements = normalizeAgreementStatus(payload);
    const charges = computeCharges(payload);

    const blockedReasons = [];
    if (!agreements.serviceAgreementSigned) blockedReasons.push('Service agreement is required before prefile payment gate execution.');
    if (!agreements.consentBundleSigned) blockedReasons.push('Consent bundle signature is required before invoice release.');
    if (!agreements.bankDisclosureAccepted) blockedReasons.push('Bank product disclosure acceptance is required for SBTPG routing.');
    if (!agreements.chargeAuthorizationAccepted) blockedReasons.push('Charge authorization acceptance is required before billing.');
    if (!payload.bankProductCode) blockedReasons.push('Bank product selection is required.');

    const taxRate = toAmount(payload.taxRate || 0);
    const taxAmount = toAmount(charges.subtotal * (taxRate / 100));
    const total = toAmount(charges.subtotal + taxAmount);

    const invoiceId = payload.invoiceId || `inv-${Date.now()}`;
    const invoiceNumber = payload.invoiceNumber || `RTP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    return {
        paymentGateway: {
            provider: 'SBTPG',
            environment: config.sbtpg.environment,
            syncMode: config.sbtpg.syncMode,
            bankProductCode: payload.bankProductCode || null,
            bankProductName: payload.bankProductName || 'Not Selected',
            gatewayStatus: blockedReasons.length === 0 ? 'READY_TO_PREFILE' : 'BLOCKED'
        },
        prefileInvoice: {
            invoiceId,
            invoiceNumber,
            clientId: payload.clientId || 'UNASSIGNED',
            taxpayerName: payload.taxpayerName || 'Taxpayer',
            charges: charges.items,
            subtotal: charges.subtotal,
            taxRate,
            taxAmount,
            total,
            status: blockedReasons.length === 0 ? 'PREFILE_READY' : 'HOLD'
        },
        agreements,
        consents: {
            consentBundleId: payload.consentBundleId || `consent-${Date.now()}`,
            consentStatus: agreements.consentBundleSigned ? 'SIGNED' : 'MISSING'
        },
        blockedReasons,
        nextAction: blockedReasons.length === 0 ? 'Submit prefile invoice to payment gateway.' : 'Resolve blocked requirements before submission.'
    };
}

function buildFinanceReconciliationTools(payload = {}) {
    const invoiceTotal = toAmount(payload.invoiceTotal || 0);
    const settledAmount = toAmount(payload.settledAmount || 0);
    const bankDepositAmount = toAmount(payload.bankDepositAmount || 0);
    const processingFees = toAmount(payload.processingFees || 0);

    const expectedNet = toAmount(invoiceTotal - processingFees);
    const variance = toAmount(bankDepositAmount - expectedNet);

    const transactions = [
        { label: 'Invoice Total', amount: invoiceTotal },
        { label: 'Settled Amount', amount: settledAmount },
        { label: 'Bank Deposit', amount: bankDepositAmount },
        { label: 'Processing Fees', amount: processingFees },
        { label: 'Expected Net', amount: expectedNet }
    ];

    const reconciliationStatus = variance === 0 && settledAmount === invoiceTotal
        ? 'RECONCILED'
        : 'REVIEW_REQUIRED';

    return {
        reconciliationStatus,
        variance,
        transactions,
        controls: [
            'Invoice-to-settlement tie-out',
            'SBTPG settlement trace validation',
            'Charge authorization audit check',
            'Agreement and consent completion gate'
        ],
        recommendations: reconciliationStatus === 'RECONCILED'
            ? ['Mark invoice as settled', 'Archive reconciliation evidence']
            : ['Investigate settlement mismatch', 'Confirm fees and bank deposit trace', 'Hold release until variance is resolved']
    };
}

module.exports = {
    buildPrefilePaymentGate,
    buildFinanceReconciliationTools
};
