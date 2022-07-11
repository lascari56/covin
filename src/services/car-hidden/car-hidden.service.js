// Initializes the `carHidden` service on path `/car-hidden`
const { CarHidden } = require('./car-hidden.class');
const createModel = require('../../models/car-hidden.model');
const hooks = require('./car-hidden.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/car-hidden', new CarHidden(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car-hidden');

  service.hooks(hooks);
};
