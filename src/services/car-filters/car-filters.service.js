// Initializes the `car-filters` service on path `/car-filters`
const { CarFilters } = require('./car-filters.class');
const createModel = require('../../models/car-filters.model');
const hooks = require('./car-filters.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/car-filters', new CarFilters(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car-filters');

  service.hooks(hooks);
};
