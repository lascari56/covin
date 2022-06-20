const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

exports.Cars = class Cars extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async find (data, params) {
    return await super.find({
      query: data?.query,
      queryModifier: (query, params) => {
        query.allowDiskUse();
      }
    });
  }
};
