const { authenticate } = require('@feathersjs/authentication').hooks;

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
      context.data.client = context.params.user;

      const car = await context.app.service("cars").get(context.data.car);

      context.data.auction = {...context.data.auction, auctionDate: car.auction_date, status: false};
      context.data.buyNow = {...context.data.buyNow, price: car?.price_new || null, status: false};

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
