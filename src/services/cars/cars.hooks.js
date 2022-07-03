const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search');

const createModelCarFilters = require('../../models/car-filters.model');

module.exports = {
  before: {
    all: [
      authenticate('jwt')
      // search({  // regex search on given fields
      //   fields: ['title']
      // })
    ],
    find: [
      search({
        fields: ['title', 'lot_id', 'vin']
      })
    ],
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
          const modelCarFilters = createModelCarFilters(context.app);
          const filters = await modelCarFilters.find();

          context.result.filters = filters[0];
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
