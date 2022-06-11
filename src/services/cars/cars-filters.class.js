const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

const axios = require('axios').default;

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
  }

  async find () {
    let data = this.model.find();



    return true;
  }
};
