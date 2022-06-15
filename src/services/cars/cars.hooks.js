const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-mongodb-fuzzy-search');

const createModel = require('../../models/cars.model');

module.exports = {
  before: {
    all: [
      // authenticate('jwt')
      // search({  // regex search on given fields
      //   fields: ['title']
      // })
    ],
    find: [
      search({  // regex search on given fields
        fields: ['title']
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
          let filters = {
            make: {},
            model: {},
            series: {},
            year: {},
            odometer: {},
            loss: {},
            damage_pr: {},
            damage_sec: {},
            drive: {},
            status: {},
            keys: {},
            transmission: {},
            engine: {},
            fuel: {},
            cost_repair: {},
            location: {},
            document: {},
            site: {},
          };

          const model = createModel(context.app);

          const data = await model.find();

          for (let item of data) {
            for (let filter of Object.keys(filters)) {
              let key = null;

              if (filter === 'model') key = `${item.make}`;
              else if (filter === 'series') key = `${item.make}|${item.model}`;
              else key = item[filter];

              if (!filters[filter][key]) filters[filter][key] = {};

              if (filter === 'model' || filter === 'series') {
                if (filters[filter][key][item[filter]]) filters[filter][key][item[filter]].count += 1;
                else filters[filter][key][item[filter]] = {count: 1};
              } else {
                if (filters[filter][key].count) filters[filter][key].count += 1;
                else filters[filter][key] = {count: 1};
              }
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
