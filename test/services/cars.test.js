const assert = require('assert');
const app = require('../../src/app');

describe('\'cars\' service', () => {
  it('registered the service', () => {
    const service = app.service('cars');

    assert.ok(service, 'Registered the service');
  });
});
