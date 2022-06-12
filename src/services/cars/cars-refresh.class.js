const { Service } = require('feathers-mongoose');

const createModel = require('../../models/cars.model');

const axios = require('axios').default;
const moment = require('moment');

exports.CarsRefresh = class CarsRefresh {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async find () {
    // const lots = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart.php?api_key=E5nH1rkFKQ8Xr38mPag');
    // const selledLots = await axios.get('https://vmi423304.contaboserver.net/API/api2_1_iaai_copart_sold_lots.php?api_key=E5nH1rkFKQ8Xr38mPag');
    // const selledLotIds = selledLots.data.map((item) => item.lot_id);

    // // console.log("selledLotIds", selledLotIds);

    // const endLots = this.app.service('cars').find({
    //   query: {
    //     auction_date: {
    //       $lt: new Date().getTime()
    //     }
    //   }
    // });

    // const endLots = await this.model.find({
    //   auction_date: {
    //     // $lte: moment().add(1, 'days').unix(),
    //     $gte: moment().unix(),
    //   }
    // });

    const lots = await this.model.find();

    // for (let doc of lots) {
    //   doc.auction_date = new Date(doc.auction_date);

    //   await doc.save();
    // }

    // const records = await this.model.find({ 'lot_id': { $in: selledLotIds } });

    // for (let item of lots.data) {
    //   let res = await this.model.findOneAndUpdate({'lot_id': item.lot_id}, item);

    //   if (!res && ) this.model.create(item);
    // };

    // return moment('2022-06-10 17:00:00').toDate();
    return {"data": lots};
  }
};
