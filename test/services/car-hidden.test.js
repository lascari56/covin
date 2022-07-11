const assert = require('assert');
const app = require('../../src/app');

describe('\'carHidden\' service', () => {
  it('registered the service', () => {
    const service = app.service('car-hidden');

    assert.ok(service, 'Registered the service');
  });
});
