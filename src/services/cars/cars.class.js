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

    // console.log("query", query);

    // return [];

    // return await this.app.service('cars').Model.aggregate([
    //   { $sort : { auction_date_api: 1 } }
    // ]).limit(10);

    // return await this.app.service('cars').find({$limit: 10});

    return await super.find({
      query: query,
      queryModifier: (query, params) => {
        query.allowDiskUse();
      }
    });
  }
};
