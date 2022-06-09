// Initializes the `cars` service on path `/cars`
const { Cars } = require('./cars.class');
const createModel = require('../../models/cars.model');
const hooks = require('./cars.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cars', new Cars(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cars');

  service.hooks(hooks);
};
