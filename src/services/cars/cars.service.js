// Initializes the `cars` service on path `/cars`
const { Cars } = require('./cars.class');
const { CarsRefresh } = require('./cars-refresh.class');
const createModel = require('../../models/cars.model');
const hooks = require('./cars.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    // paginate: {
    //   default: 20,
    //   max: 20
    // },
    whitelist: ['$text','$search', '$regex']
  };

  // Initialize our service with any options it requires
  app.use('/cars', new Cars(options, app));

  app.use('/cars-refresh', new CarsRefresh(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cars');

  service.hooks(hooks);
};
