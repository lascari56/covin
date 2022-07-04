const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');
const createModelHistoryCars = require('../../models/history-cars.model');
const createModelCarFilters = require('../../models/car-filters.model');
const createModelLogs = require('../../models/logs.model');

const axios = require('axios').default;
const moment = require('moment');
const fs = require('fs');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
    this.modelHistoryCars = createModelHistoryCars(app);
    this.modelCarFilters = createModelCarFilters(app);
    this.modelLogs = createModelLogs(app);
    this.app = app;
  }

  async find () {
    // return new Date().getTime();

    // let data = await this.model.aggregate([
    //   {
    //     $group:
    //     {
    //       _id: {
    //         auction_date: "$auction_date",
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // console.log("data", data);

    // return;

    try {
      const {lots, fileName} = await this.getLots();

      // return {lots, fileName: lots};

      const selledLots = await this.getLotsSelled();

      const selledLotIds = selledLots.map((item) => item.lot_id);

      // return {data: lots};

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
      }).select("lot_id").allowDiskUse(true);

      const endLotsIds = endLots.map((item) => item.lot_id);

      await this.modelHistoryCars.insertMany(endLots);

      await this.model.deleteMany({lot_id: {$in: endLotsIds}});

      const statistics = {
        update: 0,
        add: 0,
        copart: 0,
        iaai: 0,
      };

      for (let item of lots) {
        let _item = {...item};

        _item.auction_date_api = _item.auction_date;
        _item.auction_date = _item.auction_date ? moment(_item.auction_date).unix() : null;
        _item.auction_date_known = !!_item.auction_date;

        let res = await this.model.findOneAndUpdate({'lot_id': _item.lot_id}, _item);

        if (!!res) {
          statistics.update += 1;
          statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;
        }

        if (!res && endLotsIds.indexOf(_item.lot_id) === -1 && selledLotIds.indexOf(_item.lot_id) === -1) {
          await this.model.create(_item);

          statistics.add += 1;
          statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;
        }
      };

      await this.saveLotFilters();

      await this.modelLogs.create({
        message: `Count get api: ${lots.length}, Updated: ${statistics.update}, Added: ${statistics.add}, Deleted: ${endLotsIds.length}, Total: ${statistics.update + statistics.add}, Copart: ${statistics.copart}, IAAI: ${statistics.iaai}, File name saved: ${fileName}`,
        status: lots.length === (statistics.update + statistics.add) ? 'Success' : 'Warning',
      });

      return {"status": true, "delete:": endLotsIds.length};
    } catch (error) {
      // await this.modelLogs.create({
      //   message: `${error}`,
      //   status: 'Error',
      // });

      console.log("11111", error);

      return {"status": false};
    }
  }

  async getLots() {
    return await axios.get(`https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag`).then((res) => {
      // if (!res.data[0]) return res.data;
      // else {
      //   return await this.getLots();
      // }

      const fileName = moment().unix();

      fs.writeFile(`./public/lots/${fileName}.txt`, JSON.stringify(res.data), function (err) {
        if (err) {console.log("file error", err)}
        console.log('Saved!');
      });

      return {lots: typeof res.data !== 'object' || !res.data.length ? [] : res.data, fileName};
    }).catch(async (e) => {
      console.log("eeee", e);
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

    for (let filter of Object.keys(filters)) {
      let data = await this.model.aggregate([
        {
          $group:
          {
            _id: {
              make: "$make",
              model: "$model",
              series: "$series",
              [filter]: `$${filter}`
            },
            count: { $sum: 1 },
          },
        },
      ]);

      for (let item of data) {
        let key = null;

        if (filter === 'model') key = `${item._id.make}`;
        else if (filter === 'series') key = `${item._id.make}|${item._id.model}`;
        else key = item._id[filter];

        if (!filters[filter][key]) filters[filter][key] = {};

        if (filter === 'model' || filter === 'series') {
          if (filters[filter][key][item._id[filter]]) filters[filter][key][item._id[filter]].count += 1;
          else filters[filter][key][item._id[filter]] = {count: 1};
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
