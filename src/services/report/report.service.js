// Initializes the `report` service on path `/report`
const { Report } = require('./report.class');
const createModel = require('../../models/report.model');
const hooks = require('./report.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/report', new Report(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('report');

  service.hooks(hooks);
};
