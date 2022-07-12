const { authenticate } = require('@feathersjs/authentication').hooks;

const {getVinReport} = require('../../controllers/reportController');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [async context => {
      context.params.query = {
        client: {
          $in: context.params.user._id
        }
      };

      return context;
    }],
    get: [],
    create: [async context => {
      // console.log("context", context);
      // if (context.params.user.balance <= 0) {
      //   throw new Error('Your balance is empty');
      // }

      context.data.client = context.params.user;
      context.data.status = 'pending';

      return context;
    }],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [async context => {
      context.result.client = context.data.client;

      const result = await getVinReport(context);

      context.result = result;

      return context;
    }],
    // create: [
    //   // ReportController.getVinReport(report)
    // ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
