// Initializes the `bynowTrackings` service on path `/bynow-trackings`
const { BynowTrackings } = require('./bynow-trackings.class');
const createModel = require('../../models/bynow-trackings.model');
const hooks = require('./bynow-trackings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/bynow-trackings', new BynowTrackings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bynow-trackings');

  service.hooks(hooks);
};
