const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      async context => {
        console.log("context", context?.params?.user?._id);

        if (!!context.params.query.filter) {
          let data = [];

          if (context.params.query.filter === "purchased_reports") {
            data = await context.app.service("report").find({
              query: {
                client: {
                  $in: context?.params?.user?._id
                },
                status: "Success"
              },
              user: context?.params?.user,
              paginate: false
            });

            console.log("report", data);

            let ids = data.map((item) => item.vin);

            if (ids && ids.length) context.params.query = {
              ...context.params.query,
              vin: {
                $in: ids
              }
            };
          } else {
            data = await context.app.service(`car-${context.params.query.filter}`).find({
              query: {
                client: {
                  $in: context?.params?.user?._id
                },
              },
              user: context?.params?.user
            });

            let ids = data.map((item) => item.car);

            if (ids && ids.length) context.params.query = {
              ...context.params.query,
              _id: {
                $in: ids
              }
            };
          }
        }

        if (context.params.query.filter !== "hidden") {
          const hiddens = await context.app.service(`car-hidden`).find({
            query: {
              client: {
                $in: context?.params?.user?._id
              }
            },
            user: context?.params?.user
          });

          let hiddenids = hiddens.map((item) => item.car);

          if (hiddenids && hiddenids.length) context.params.query = {
            ...context.params.query,
            _id: {
              ...context.params.query._id,
              $nin: hiddenids
            }
          };
        }

        return context;
        // console.log("comments", comments);
      }
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
          // const modelCarFilters = createModelCarFilters(context.app);
          // const filters = await modelCarFilters.find();
          const filters = await context.app.service("car-filters").find();

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
    find: [
      async (context) => {
        console.log('====================================');
        console.log("error", context);
        console.log('====================================');
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
