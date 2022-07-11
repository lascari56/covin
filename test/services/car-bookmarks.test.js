const assert = require('assert');
const app = require('../../src/app');

describe('\'carBookmarks\' service', () => {
  it('registered the service', () => {
    const service = app.service('car-bookmarks');

    assert.ok(service, 'Registered the service');
  });
});
