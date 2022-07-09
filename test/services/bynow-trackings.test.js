const assert = require('assert');
const app = require('../../src/app');

describe('\'bynowTrackings\' service', () => {
  it('registered the service', () => {
    const service = app.service('bynow-trackings');

    assert.ok(service, 'Registered the service');
  });
});
