const assert = require('assert');
const app = require('../../src/app');

describe('\'car-notifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('car-notifications');

    assert.ok(service, 'Registered the service');
  });
});
