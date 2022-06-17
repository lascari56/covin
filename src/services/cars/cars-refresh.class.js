const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');
const createModelHistoryCars = require('../../models/history-cars.model');
const createModelCarFilters = require('../../models/car-filters.model');

const axios = require('axios').default;
const moment = require('moment');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
    this.modelHistoryCars = createModelHistoryCars(app);
    this.modelCarFilters = createModelCarFilters(app);
    this.app = app;
  }

  async find () {
    return {"status": true};

    const lots = await this.getLots();

    const selledLots = await this.getLotsSelled();

    const selledLotIds = selledLots.map((item) => item.lot_id);

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

    for (let item of lots) {
      item.auction_date_api = item.auction_date;
      item.auction_date = item.auction_date ? moment(item.auction_date).unix() : null;

      let res = await this.model.findOneAndUpdate({'lot_id': item.lot_id}, item);

      if (!res && endLotsIds.indexOf(item.lot_id) === -1 && selledLotIds.indexOf(item.lot_id) === -1) this.model.create(item);
    };

    await this.saveLotFilters();

    return {"status": true};
  }

  async getLots() {
    return await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag').then((res) => {
      return res.data;
    }).catch(async (e) => {
      return await this.getLots();
    });
  }

  async getLotsSelled() {
    return await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart_sold_lots.php?api_key=E5nH1rkFKQ8Xr38mPag').then((res) => {
      return res.data;
    }).catch(async (e) => {
      return await this.getLotsSelled();
    });
  }

  async saveLotFilters() {
    let filters = {
      make: {},
      model: {},
      series: {},
      // year: {},
      // odometer: {},
      loss: {},
      damage_pr: {},
      damage_sec: {},
      drive: {},
      status: {},
      keys: {},
      transmission: {},
      engine: {},
      fuel: {},
      // cost_repair: {},
      location: {},
      document: {},
      site: {},
    };

    const data = await this.model.find();

    for (let item of data) {
      for (let filter of Object.keys(filters)) {
        let key = null;

        if (filter === 'model') key = `${item.make}`;
        else if (filter === 'series') key = `${item.make}|${item.model}`;
        else key = item[filter];

        if (!filters[filter][key]) filters[filter][key] = {};

        if (filter === 'model' || filter === 'series') {
          if (filters[filter][key][item[filter]]) filters[filter][key][item[filter]].count += 1;
          else filters[filter][key][item[filter]] = {count: 1};
        } else {
          if (filters[filter][key].count) filters[filter][key].count += 1;
          else filters[filter][key] = {count: 1};
        }
      }
    }

    let res = await this.modelCarFilters.findOneAndUpdate({}, filters);

    if (!res) await this.modelCarFilters.create(filters);

    return true;
  }

  // async updateData() {
  //   let data = await this.model.find();

  //   let coincidences = {
  //     loss: {

  //     }
  //   }

  //   for (let item of data) {

  //   }
  // }
};
