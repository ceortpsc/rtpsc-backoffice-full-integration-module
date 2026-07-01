const test = require('node:test');
const assert = require('node:assert/strict');
const { listServices, getServiceByCode, searchServices } = require('../platform/finance/services-catalog');

test('service catalog includes over 50 services with summary and explanation', () => {
    const services = listServices();
    assert.ok(services.length > 50);
    services.forEach((service) => {
        assert.equal(typeof service.summary, 'string');
        assert.equal(typeof service.explanation, 'string');
        assert.ok(service.summary.length > 10);
        assert.ok(service.explanation.length > 20);
    });
});

test('service catalog can filter by category and tier', () => {
    const compliance = listServices({ category: 'Compliance' });
    assert.ok(compliance.length > 0);
    assert.ok(compliance.every((item) => item.category === 'Compliance'));

    const luxury = listServices({ tier: 'Luxury' });
    assert.ok(luxury.length > 0);
    assert.ok(luxury.every((item) => item.tier === 'Luxury'));
});

test('service catalog supports lookup and search', () => {
    const service = getServiceByCode('SVC-055');
    assert.ok(service);
    assert.match(service.name, /Enterprise Readiness Review/);

    const found = searchServices('attorney oversight');
    assert.ok(found.some((item) => item.code === 'SVC-028'));
});
