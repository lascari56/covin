const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      async context => {
        let data = context.result.data;
        const ids = [];

        for (let item of data) {
          if (item?.client) ids.push(item.client);
        }

        const users = await context.app.service('users').find({
          query: {
            _id: {
              $in: ids
            }
          },
          user: context?.params?.user
        });

        for (let index in data) {
          let item = data[index];

          if (item?.client) {
            for (let user of users) {
              if (item.client && item.client.toString() === user._id.toString()) data[index].client = user?.email;
            }
          }
        }

        context.result.data = data;

        return context;
      }
    ],
    get: [],
    create: [],
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
