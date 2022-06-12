const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

const axios = require('axios').default;
const moment = require('moment');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
  }

  async find () {
    const {data} = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag');

    for (let item of data) {
      item.auction_date = item.auction_date ? moment(item.auction_date).toDate() : null;

      let res = await this.model.findOneAndUpdate({'lot_id': item.lot_id}, item);

      if (!res) this.model.create(item);
    };

    return true;
  }
};
