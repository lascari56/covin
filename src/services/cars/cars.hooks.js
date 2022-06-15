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

          console.log('====================================');
          console.log("data", data[0]?.make);
          console.log('====================================');

          for (let item of data) {
            for (let filter of Object.keys(filters)) {
              let key = null;


              if (filter === 'model') key = `${item.make}|${item.model}`;
              else if (filter === 'series') key = `${item.make}|${item.model}|${item.series}`;
              else key = item[filter];

              if (filters[filter][key]) filters[filter][key].count += 1;
              else filters[filter][key] = {count: 1};

              // if (filter === 'model' || filter === 'series') {
              //   filters[key][item[filter]] = {...filters[key][item[filter]], make: item.make, model: item.model};
              // }
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
