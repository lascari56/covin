// Initializes the `car-notifications` service on path `/car-notifications`
const { CarNotifications } = require('./car-notifications.class');
const createModel = require('../../models/car-notifications.model');
const hooks = require('./car-notifications.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/car-notifications', new CarNotifications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car-notifications');

  service.once('patched', data =>
    console.log('First time a message has been removed', data)
  );

  service.hooks(hooks);
};
