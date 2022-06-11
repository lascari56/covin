const { authenticate } = require('@feathersjs/authentication').hooks;

const createModel = require('../../models/cars.model');

module.exports = {
  before: {
    // all: [ authenticate('jwt') ],
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
        if (context?.params?.query?.full) {
          let filters = {
            make: {},
            model: {},
            series: {},
            odometer: {},
            location: {},
            status: {},
            keys: {},
            fuel: {},
            drive: {},
            engine: {},
            document: {},

          };

          const model = createModel(context.app);

          const data = await model.find();

          for (let item of data) {
            for (let key of Object.keys(filters)) {
              if (filters[key][item[key]]) filters[key][item[key]] += 1;
              else filters[key][item[key]] = 1;
            }
          }

          context.result.filters = filters;
        }

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
