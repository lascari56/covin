const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')

exports.getReport = async (vin, userId, reBuy, app) => {

  let report = null

  let url = `http://covin.top/carfax/get_data.php?vin=${vin}&source=OAE3&token=asdSdDASWDJK`;

  if (!!reBuy) url += `&re_buy=${reBuy}`

  const config = {
    method: 'get',
    url,
    headers: {
      Accept: 'application/json',
    },
  }

  try {
    await axios(config).then( async response => {
      console.warn('AOE3', response.data)

      if (response.data[0]?.result === 'true'){
        report = {
          vin: vin,
          client: userId,
          file: response.data[0].link,
          bonusSticker: response.data[0].sticker,
        }

        await app.services["logs"].create({
          api: 'CarFax_OAE3',
          status: 'SUCCESS',
          client: userId,
          vin: vin
        });

        return report;
      } else {
        console.log("Report not found");
        throw new Error('Report not found')
      }

      // await app.service('logs').create({
      //   api: 'CarFax_OAE3',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin
      // });

      // const log = new Log({
      //   api: 'CarFax_OAE3',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()

    })
  } catch (e) {
    await app.service('logs').create({
      message: e.message,
      api: 'CarFax_OAE3',
      status: 'ERROR',
      client: userId,
      vin: vin
    });

    // const log = new Log({
    //   message: e.message,
    //   api: 'CarFax_OAE3',
    //   status: 'ERROR',
    //   client: userId,
    //   vin: vin
    // })
    // await log.save()
  }
  if (report) {
    return report
  }
}
