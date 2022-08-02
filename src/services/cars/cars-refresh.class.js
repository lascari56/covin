const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');
// const createModelHistoryCars = require('../../models/history-cars.model');
// const createModelCarFilters = require('../../models/car-filters.model');
// const createModelLogs = require('../../models/logs.model');

const axios = require('axios').default;
const moment = require('moment');
const fs = require('fs');
const { getBase64DataURI } = require('dauria');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
    // this.modelHistoryCars = createModelHistoryCars(app);
    // this.modelCarFilters = createModelCarFilters(app);
    // this.modelLogs = createModelLogs(app);
    this.app = app;
    this.countError = 0;
    this.fileName = null;
    this.fileNameSelled = null;
  }

  async find () {
    // await this.app.service("car-notifications").patch("62e6a526dc5882ecd778bb08", {
    //   time: 15
    // })

    // return {status: true};

    // return await this.saveLotFilters();
    // await this.modelLogs.create({
    //   message: `Test`,
    //   status: 'SUCCESS',
    // });

    // await this.app.services["logs"].create({
    //   status: 'SUCCESS',
    //   message: "test"
    // });

    // return {data: true};
    // return await this.deleteRepit();
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

    // return {status: "true"};

    try {

      // return moment().unix()
      // let carNotifications = await this.app.service("car-notifications").Model.findOneAndUpdate({
      //   "buyNow.active": true,
      //   "buyNow.status": false,
      // }, {
      //   "buyNow.price": null,
      //   "buyNow.status": false
      // });

      // return carNotifications;

      let addLots = [];
      const {lots} = await this.getLots();

      // const {lots, fileName} = await this.getLotsFile();


      // return { fileName, lots };

      const selledLots = await this.getLotsSelled();

      const selledLotIds = selledLots.map((item) => item.lot_id);

      // return {data: lots};

      const endLots = await this.app.service("cars").Model.find({
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
      }).allowDiskUse(true);

      const endLotsIds = endLots.map((item) => item._id);
      const lotsIds = lots.map((item) => item.lot_id);

      // return await this.updateNotification({ids: lotsIds, data: lots});

      // return true;

      // return endLotsIds;

      await this.app.service("history-cars").Model.insertMany(endLots);

      await this.app.service("cars").Model.deleteMany({_id: {$in: endLotsIds}});
      await this.app.service("car-hidden").Model.deleteMany({car: {$in: endLotsIds}});
      await this.app.service("car-comments").Model.deleteMany({car: {$in: endLotsIds}});
      await this.app.service("car-bookmarks").Model.deleteMany({car: {$in: endLotsIds}});
      await this.app.service("car-notifications").Model.deleteMany({car: {$in: endLotsIds}});

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

        // console.log("item", item);

        let res = await this.app.service("cars").Model.findOneAndUpdate({'lot_id': _item.lot_id}, _item)

        // await this.app.service("car-notifications").Model.findOneAndUpdate({
        //   "buyNow.active": true,
        //   "buyNow.status": false,
        //   car: _item._id,
        // }, {
        //   "buyNow.price": null,
        //   "buyNow.status": false
        // });
        // .then(async (res) => {
        //   statistics.update += 1;
        //   statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;
        // })

        if (!!res) {
          statistics.update += 1;
          statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;
        }

        // if (!res && endLotsIds.indexOf(_item.lot_id) === -1 && selledLotIds.indexOf(_item.lot_id) === -1) {
        // if (!res) {
        if (!res && selledLotIds.indexOf(_item.lot_id) === -1) {
          statistics.add += 1;
          statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;

          addLots.push(_item);
          // await this.app.service("cars").create(_item).then(() => {
          //   statistics.add += 1;
          //   statistics[_item.site == '1' ? 'copart' : 'iaai'] += 1;
          // })
        }

        // return statistics;
      };

      await this.app.service("cars").Model.insertMany(addLots);

      // console.log("statistics", statistics);

      await this.saveLotFilters();

      await this.updateNotification({ids: lotsIds, data: lots});

      // await this.updateNotification({ids: lotsIds, data: lots});

      await this.app.service("logs").create({
        message: `Count get api: ${lots.length}, Updated: ${statistics.update}, Added: ${statistics.add}, Deleted: ${endLotsIds.length}, Total: ${statistics.update + statistics.add}, Copart: ${statistics.copart}, IAAI: ${statistics.iaai}, File name saved: ${this.fileName}, File selled name saved: ${this.fileNameSelled}`,
        status: lots.length === (statistics.update + statistics.add) ? 'SUCCESS' : 'WARNING',
      });

      return {"status": true, "delete:": endLotsIds.length};
    } catch (error) {

      await this.app.service("logs").create({
        message: `${error}, File name saved: ${this.fileName}`,
        status: 'ERROR',
      });

      console.log("11111", error);

      return {"status": false};
    }
  }

  async getLots(retry) {
    return await axios.get(`https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag`).then(async (res) => {
      // if (!res.data[0]) return res.data;
      // else {
      //   return await this.getLots();
      // }



      // return {lots: {}, fileName: {}};

      let _res = res.data;

      if (typeof _res !== 'object') _res = [];

      if (!Array.isArray(_res)) _res = Object.values(_res);

      // const fileName = moment().unix();

      // console.log("_res", _res);

      // c

      // const blob = {
      //   uri: getBase64DataURI(new Buffer(JSON.stringify(_res)), 'text/plain'),
      //   ACL: 'public-read',
      //   // filename: `${fileName}.txt`
      // };

      // const blobService = this.app.service('upload');

      // blobService.before({
      //   create(hook) {
      //     hook.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
      //   }
      // });

      // const resFile = await blobService.create(blob, {
      //   s3: { ACL: 'public-read' }
      // });

      this.fileName = await this.saveFile(_res);


      // .then(function (result) {
      //   // console.log('Stored blob with id', result);
      // }).catch(err => {
      //   console.error(err);
      // });

      // console.log("resFile", resFile);

      // let resFile = fs.writeFile(`./public/lots/${fileName}.txt`, JSON.stringify(_res), async (err, data) => {


      //   if (err) {console.log("file error", err)}
      //   else {
      //     const service = await c.create({uri: `https://covin-dev.herokuapp.com/lots/${fileName}.txt}`});

      //     console.log("service", service);

      //     this.app.service('blobs').on('created', (file) => {
      //       console.log('Received file created event!', file);
      //   });
      //   }
      //   console.log('Saved!', data);
      // });

      return {lots: _res};
    }).catch(async (e) => {

      console.log("eeee", e);

      await this.app.service("logs").create({
        message: `${error}, File name saved: ${this.fileName}`,
        status: 'ERROR',
      });

      return await this.getLots();

      // this.countError += 1;

      // if (this.countError <= 3) {

      //   return await this.getLots();
      // } else return e.data;
    });
  }

  async getLotsFile() {
    return await axios.get('https://unocreative.ams3.cdn.digitaloceanspaces.com/5a2524c52c5446a718fd1c3a2daa2ba7e94981f124997788ceb9414929217495.txt').then((res) => {
      // console.log("res", res);

    return {lots: res.data, fileName: "resFile?.id"};
    }).catch(async (e) => {
      console.log("e", e);
      // return await this.getLotsSelled();
    });
  }

  async getLotsSelled() {
    return await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart_sold_lots.php?api_key=E5nH1rkFKQ8Xr38mPag').then(async (res) => {
      this.fileNameSelled = await this.saveFile(res.data);

      return res.data;
    }).catch(async (e) => {
      return await this.getLotsSelled();
    });
  }

  async saveLotFilters() {
    // return true;
    // const filter = "make";

    // let options = {};

    // if (filter === "model") {
    //   options = {
    //     make: "$make",
    //     model: "$model"
    //   }
    // } else if (filter === "series") {
    //   options = {
    //     make: "$make",
    //     model: "$model",
    //     series: "$series",
    //   }
    // } else {
    //   options = {
    //     [filter]: `$${filter}`
    //   }
    // }


    // let data = await this.model.aggregate([
    //   {
    //     $group: {
    //       _id: options,
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // let data = await this.app.service("cars").Model.aggregate([
    //   {
    //     $group: {
    //       _id: {
    //         make: "$make",
    //         model: "$model",
    //         series: "$series",
    //         // [filter]: `$${filter}`
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // return data;

    let filters = {
      make: {},
      model: {},
      series: {},
      loss: {},
      damage_pr: {},
      damage_sec: {},
      drive: {},
      status: {},
      keys: {},
      transmission: {},
      engine: {},
      fuel: {},
      location: {},
      document: {},
      site: {},
    };

    for (let filter of Object.keys(filters)) {
      // console.log('====================================');
      // console.log("filter", filter);
      // console.log('====================================');

      let options = {};

      if (filter === "model") {
        options = {
          make: "$make",
          model: "$model"
        }
      } else if (filter === "series") {
        options = {
          make: "$make",
          model: "$model",
          series: "$series",
        }
      } else {
        options = {
          [filter]: `$${filter}`
        }
      }

      console.log('====================================');
      console.log("options", options);
      console.log('====================================');

      let data = await this.model.aggregate([
        {
          $group:
          {
            _id: options,
            count: { $sum: 1 },
          },
        },
      ]);

      // return data;

      for (let item of data) {
        let key = null;

        if (filter === 'model') key = `${item._id.make}`;
        else if (filter === 'series') key = `${item._id.make}|${item._id.model}`;
        else key = item._id[filter];

        // if (!filters[filter][key]) filters[filter][key] = {count: item.count};
        if (!filters[filter][key]) filters[filter][key] = {};

        if (filter === 'model' || filter === 'series') {
          filters[filter][key][item._id[filter]] = {count: item.count};
        //   if (filters[filter][key][item._id[filter]]) filters[filter][key][item._id[filter]].count += 1;
        //   else filters[filter][key][item._id[filter]] = {count: 1};
        } else {
          filters[filter][key] = {count: item.count};
        //   if (filters[filter][key].count) filters[filter][key].count += 1;
        //   else filters[filter][key] = {count: 1};
        }
      }
    }

    // return filters;

    let res = await this.app.service("car-filters").Model.findOneAndUpdate({}, filters);

    if (!res) await this.app.service("car-filters").create(filters);

    return true;
  }

  async deleteRepit() {
    let data = await this.app.service("cars").Model.aggregate([
      {
        $group:
        {
          // _id: {
          //   make: "$make",
          //   model: "$model",
          //   series: "$series",
          //   [filter]: `$${filter}`
          // },
          _id: "$vin",
          count: { $sum: 1 },
        },
      },
    ]);

    let _data = data.filter((el) => el.count >= 2);

    for (let item of _data) {
      let res = await this.app.service("cars").Model.deleteOne({vin: item._id})

      // await this.model.delete({_id: res._id});
      console.log("res", res);
    }

    // const ids = res.map((el) => )

    return _data;
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

  async saveFile(data) {
    const blob = {
      uri: getBase64DataURI(new Buffer(JSON.stringify(data)), 'text/plain'),
      ACL: 'public-read',
      // filename: `${fileName}.txt`
    };

    const blobService = this.app.service('upload');

    const resFile = await blobService.create(blob, {
      s3: { ACL: 'public-read' }
    });

    return resFile?.id
  }

  async updateNotification({ids, data}) {
    // if (data.price_new) {
      let items = await this.app.service("car-notifications").Model.find({
        $or: [
          {
            "buyNow.active": true,
            "buyNow.status": false,
          },
          {
            "auction.active": true,
            "auction.status": false,
          }
        ],
        lotId: {
          $in: ids
        },
      });

      // return items;

      for (let item of items) {
        let res = {};
        let isChange = false;

        const car = await this.app.service("cars").get(item.car);

        // return {res: moment(car.auction_date).unix() === moment(res.auction.auctionDate).unix()};

        // return {car:  moment(car.auction_date).unix(), auctionDate: moment(res.auction.auctionDate).unix()};

        if (item.buyNow.price !== car.price_new) {
          res.buyNow = {...item.buyNow, price: car.price_new};
          // res.buyNow.price = car.price_new;

          console.log('====================================');
          console.log("car.price_new", car.price_new);
          console.log('====================================');

          isChange = true;
        }

        if (moment(car.auction_date).unix() !== moment(item.auction.auctionDate).unix()) {
          // res.auction.auctionDate = car.auction_date;
          res.auction = {...item.auction, auctionDate: car.auction_date};

          console.log('====================================');
          console.log("car.auction_date", car.auction_date);
          console.log('====================================');

          isChange = true;
        }

        // return res;

        if (isChange) {
          console.log("isChange");
          await this.app.service("car-notifications").patch(item._id, res)
        }

        // return {isChange};

        // let res = {...item};

        // if (condition) {

        // }
      }

      return true;

      // {
      //   $in: ids
      // }
    // }

    // await this.app.service("car-notifications").Model.findOneAndUpdate({
      // "auction.active": true,
      // "auction.status": false,
    //   car: _item._id,
    // }, {
    //   "buyNow.auctionDate": data.auction_date,
    // });
  }
};
