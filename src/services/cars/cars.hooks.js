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
        let data = context.result.data;
        const ids = data.map((item) => item._id);

        const comments = await context.app.service('car-comments').find({
          query: {
            car: {
              $in: ids
            }
          },
          user: context?.params?.user
        });

        const bookmarks = await context.app.service('car-bookmarks').find({
          query: {
            car: {
              $in: ids
            }
          },
          user: context?.params?.user
        });

        const hiddens = await context.app.service('car-hidden').find({
          query: {
            car: {
              $in: ids
            }
          },
          user: context?.params?.user
        });

        for (let index in data) {
          let item = data[index];

          for (let comment of comments) {
            if (item._id.toString() === comment.car.toString()) data[index].comment = comment;
          }

          for (let bookmark of bookmarks) {
            if (item._id.toString() === bookmark.car.toString()) data[index].bookmark = bookmark;
          }

          for (let hidden of hiddens) {
            if (item._id.toString() === hidden.car.toString()) data[index].hidden = hidden;
          }


          // const index = data.findIndex((el) => {
          //   return el._id.toString() === item.car.toString();
          // });
        }

        // for (let item of commetns) {
        //   const index = data.findIndex((el) => {
        //     return el._id.toString() === item.car.toString();
        //   });

        //   if (index !== -1) data[index].comment = item;
        // }


        context.result.data = data;

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
