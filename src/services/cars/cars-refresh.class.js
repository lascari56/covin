const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');
const createModelHistoryCars = require('../../models/history-cars.model');

const axios = require('axios').default;
const moment = require('moment');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
    this.modelHistoryCars = createModelHistoryCars(app);
    this.app = app;
  }

  async find () {
    const lots = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag');
    const selledLots = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart_sold_lots.php?api_key=E5nH1rkFKQ8Xr38mPag');
    const selledLotIds = selledLots.data.map((item) => item.lot_id);

    const endLots = await this.model.find({
      $or: [
        {
          auction_date: {
            $lte: moment().subtract(3, 'hours').unix(),
          }
        },
        {
          lot_id: {
            $in: selledLotIds,
          }
        }
      ],
    });

    const endLotsIds = endLots.map((item) => item.lot_id);

    await this.modelHistoryCars.insertMany(endLots);

    await this.model.deleteMany({lot_id: {$in: endLotsIds}});

    for (let item of lots?.data) {
      item.auction_date = item.auction_date ? moment(item.auction_date).toDate() : null;

      let res = await this.model.findOneAndUpdate({'lot_id': item.lot_id}, item);

      if (!res && endLotsIds.indexOf(item.lot_id) === -1 && selledLotIds.indexOf(item.lot_id) === -1) this.model.create(item);
    };

    return {"status": true};
  }
};
