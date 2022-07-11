const assert = require('assert');
const app = require('../../src/app');

describe('\'carComments\' service', () => {
  it('registered the service', () => {
    const service = app.service('car-comments');

    assert.ok(service, 'Registered the service');
  });
});
