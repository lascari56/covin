const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search');

const createModelUser = require('../../models/users.model');

const {getVinReport} = require('../../controllers/reportController');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      async context => {
        context.params.query = {
          ...context.params.query,
          client: {
            $in: context.params.user._id
          }
        };

        return context;
      }, search({
        fields: ['vin']
      })
    ],
    get: [],
    create: [async context => {
      // console.log("context", context);
      if (context.params.user.balance <= 0) {
        throw new Error('Your balance is empty');
      }

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
    patch: [
      async context => {
        console.log("context", context);
        if (context?.result?.status !== 'error') {
          const modelUser = createModelUser(context.app);

          const client = await modelUser.findById(context?.result?.client);

          client.balance -= context?.result?.price;

          await client.save();

          // const client = await context.app.service("users").get(context?.result?.client)

          // console.log("client", client);

          // let user = await context.app.service("users").patch(client._id, {
          //   balance: 10
          // })

          // console.log("user", user);

          // client.balance -= context?.result?.price
          // await client.save()
        }

        return context;
      }
    ],
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
