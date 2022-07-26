const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')

exports.getReport = async (vin, userId, reBuy, app) => {

  let report = null
  const data = { vin: vin }

  const config = {
    method: 'post',
    url: 'http://94.228.114.254:1300/api/oae/',
    headers: {
      'Authorization': 'VINTOKEN a3707f37c811768eb067f15c40e6046f9d2e1645'
    },
    data: data
  }

  try {
    await axios(config).then( async response => {
      report = {file: response.data}

      await app.service('logs').create({
        api: 'CarFax_OAE',
        status: 'SUCCESS',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   api: 'CarFax_OAE',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()
    })
  } catch (e) {
    if(e.response.status === 406) {
      await app.service('logs').create({
        message: e.response.data.error,
        api: 'CarFax_OAE',
        status: 'FAILED',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'CarFax_OAE',
      //   status: 'FAILED',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()
    } else {
      await app.service('logs').create({
        message: e.response.data.error,
        api: 'CarFax_OAE',
        status: 'ERROR',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'CarFax_OAE',
      //   status: 'ERROR',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()
    }
  }
  if (report) {
    return report
  }
}
