// Initializes the `carBookmarks` service on path `/car-bookmarks`
const { CarBookmarks } = require('./car-bookmarks.class');
const createModel = require('../../models/car-bookmarks.model');
const hooks = require('./car-bookmarks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/car-bookmarks', new CarBookmarks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car-bookmarks');

  service.hooks(hooks);
};
