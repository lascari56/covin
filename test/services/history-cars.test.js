const assert = require('assert');
const app = require('../../src/app');

describe('\'history-cars\' service', () => {
  it('registered the service', () => {
    const service = app.service('history-cars');

    assert.ok(service, 'Registered the service');
  });
});
