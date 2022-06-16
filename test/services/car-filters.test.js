const assert = require('assert');
const app = require('../../src/app');

describe('\'car-filters\' service', () => {
  it('registered the service', () => {
    const service = app.service('car-filters');

    assert.ok(service, 'Registered the service');
  });
});
