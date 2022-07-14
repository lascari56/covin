const { Service } = require('feathers-mongoose');

const createModel = require('../../models/logs.model');

exports.Logs = class Logs extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async create (data, params) {
    // let query = data?.query;

    console.log("query", data);

    // return [];

    // return await this.app.service('cars').Model.aggregate([
    //   { $sort : { auction_date_api: 1 } }
    // ]).limit(10);

    // return await this.app.service('cars').find({$limit: 10});

    // return {status: true};

    return await this.model.create(data);
  }
};
