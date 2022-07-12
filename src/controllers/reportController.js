// const Source = require('../models/source.model');
const { Apis } = require('../libs/api/index');
const axios = require('axios');
// const Report = require('../models/report.model');
// const { SendFunc } = require('../libs/bot/index')

exports.getVinReport = async (context) => {
  // console.log("vinReq", context);

  let sources = [];
  let result = null;


  // let res = await Source.find();

  // const res = await context.app.service('source').find({
  //   status: true,
  //   $or: [{ set: context.data.client.group }, { set: 'all' }],
  // });


  // sources = await context.app.service('source').find({
  //   query: {
  //     group: context.result.source_group,
  //     status: true,
  //     // $or: [{ set: context.result.client.group }, { set: 'all' }],
  //   }
  // });

  // console.log("res", context);

  // await context.app.service('logs').create({
  //   api: 'CarFax_OAE3',
  //   status: 'SUCCESS',
  //   // client: context.result.client._id,
  //   // vin: context.result.vin,
  // });

  let res = await context.app.service('logs').find({});

  // let res = await context.app.service('users').find({});

      console.log("logs", res);

  return {
    api: 'CarFax_OAE3',
    status: 'SUCCESS',
    client: context.result.client._id,
    vin: context.result.vin,
  };

  //TODO: Переписать. Слелать if только на сорт. Фетч данных винести из него
  if (context.result.client.group === 'old') {
    sources = await context.app.service('source').find({
      query: {
        group: context.result.source_group,
        status: true,
        $or: [{ set: context.result.client.group }, { set: 'all' }],
        $sort: { priority_new: 1 }
      }
    });
  } else {
    sources = await context.app.service('source').find({
      query: {
        group: context.result.source_group,
        status: true,
        $or: [{ set: context.result.client.group }, { set: 'all' }],
        $sort: { priority_new: 1 }
      }
    });
  }

  console.log("sources", sources);

  for (const source of sources) {
    console.log(source.name);
    const data = await Apis[source.name].getReport(
      context.result.vin,
      context.result.client._id,
      context.app
    );

    // if (source.amount < 20) {
    //   SendFunc(`${source.name} имеет на остатке ${source.amount} отчетов`)
    // }

    if (data) {
      console.log('in controller')
      console.log(data)
      context.result.file = data.file
      context.result.source = source
      context.result.status = data.status || 'Success'
      context.result.order_token = data.order_token || ''
      if (data.status !== 'error'){
        context.result.price =
        context.result.client.price[context.result.source_group] || source.sell_price
        context.result.profit = context.result.price - source.net_price;
      }
      result = context.result;
      if (data.status !== 'error') {
        await context.app.service("source").patch(source._id, {
          amount: source.amount - 1,
        });

        // const currentSource = await Source.findById(source._id)
        // currentSource.amount -= 1
        // await currentSource.save()
      }

      if (result.external) {
        console.warn('external if');
        return result;
      }

      // if (source.group === 'sticker') {
      //   console.warn('sticker if');
      //   return result;
      // }
      if (result.status === 'Success' || result.status === 'pending') {
        console.warn('sticker if success', result);

        return await context.app.service(`report`).patch(result._id, result);
      //   return  axios.post(
      //     // !!!!!!!!!!!!!!! Костыль
      //     'https://covin.pro/api/report/update-bought-report',
      //     result
      //   )
      }
    }
  }

  if (!result) {
    console.log('error');

    const existingReport = await context.app.service(`report`).patch(context.result._id, {
      status: "error",
    });

    // existingReport.status = 'error';
    // existingReport.save();

    console.log(existingReport);
  }
};
