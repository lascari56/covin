const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

const axios = require('axios').default;

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
  }

  async find () {
    const {data} = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag');

    for (let item of data) {
      await this.model.findOneAndUpdate({'lot_id': item.lot_id}, item);
    };

    return true;
  }
};
