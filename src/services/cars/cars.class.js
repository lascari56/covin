const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

exports.Cars = class Cars extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  // async find (data, params) {
  //   console.log("params", params);

  //   // return [];

  //   return await this.model.find({}).sort({"auction_date_api" : 1}).limit(10).skip(3000 * 10).allowDiskUse(true);



  //   // return await super.find({query: {
  //   //   $limit: 10,
  //   //   $sort: {
  //   //     "auction_date_api": 1
  //   //   },
  //   //   $skip: 17000 * 10,
  //   // }});
  // }
};
