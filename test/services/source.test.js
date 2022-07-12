const assert = require('assert');
const app = require('../../src/app');

describe('\'source\' service', () => {
  it('registered the service', () => {
    const service = app.service('source');

    assert.ok(service, 'Registered the service');
  });
});
