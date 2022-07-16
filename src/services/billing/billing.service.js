// Initializes the `billing` service on path `/billing`
const { Billing } = require('./billing.class');
const { BillingStatus } = require('./billing-status.class');
const createModel = require('../../models/billing.model');
const hooks = require('./billing.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/billing', new Billing(options, app));
  app.use('/billing-status', new BillingStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('billing');

  service.hooks(hooks);
};
