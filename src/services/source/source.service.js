// Initializes the `source` service on path `/source`
const { Source } = require('./source.class');
const createModel = require('../../models/source.model');
const hooks = require('./source.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/source', new Source(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('source');

  service.hooks(hooks);
};
