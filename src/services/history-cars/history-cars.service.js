// Initializes the `history-cars` service on path `/history-cars`
const { HistoryCars } = require('./history-cars.class');
const createModel = require('../../models/history-cars.model');
const hooks = require('./history-cars.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/history-cars', new HistoryCars(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('history-cars');

  service.hooks(hooks);
};
