// Initializes the `carComments` service on path `/car-comments`
const { CarComments } = require('./car-comments.class');
const createModel = require('../../models/car-comments.model');
const hooks = require('./car-comments.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/car-comments', new CarComments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car-comments');

  service.hooks(hooks);
};
