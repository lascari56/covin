const { Service } = require('feathers-mongoose');

exports.Cars = class Cars extends Service {
  async find (data, params) {
    console.log("params", params);

    return await super.find(data, params);
  }
};
