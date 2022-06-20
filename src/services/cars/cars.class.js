const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

exports.Cars = class Cars extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async find (data, params) {
    let query = data?.query;

    if (query?.make && !Array.isArray(query?.make)) {
      query.make = Object.values(query?.make)
    }

    return await super.find({
      query: query,
      queryModifier: (query, params) => {
        query.allowDiskUse();
      }
    });
  }
};
