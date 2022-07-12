const axios = require('axios')
// const Log = require('../../models/Log')

exports.getReport = async (vin, userId, app) => {

  let report = null
  console.log('IN HELPER')


  const config = {
    method: 'get',
    url: 'https://autohelperbot.com/api/get-autocheck/' + vin,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer 648105b3ce340e56bac4dc53662288c0ff1a667342a6bf9ddd31755fd8b27b4d'
    }
  }

  try {
    await axios(config).then(async response => {
      console.log('HELPER')
      console.log(response.data)
      report = {
        order_token: response.data.order_token,
        status: response.data.status,
        vin: vin,
        client: userId
      }
      console.log(report)

      const log = await app.service('logs').create({
        api: 'Autocheck_Helper',
        status: 'SUCCESS',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   api: 'Autocheck_Helper',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()
    })
  } catch (e) {
    console.log(e)
    if (e.response.status === 406) {
      const log = await app.service('logs').create({
        message: e.response.data.error,
        api: 'Autocheck_Helper',
        status: 'FAILED',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'Autocheck_Helper',
      //   status: 'FAILED',
      //   client: userId,
      //   vin: vin
      // })
      // await log.save()
    } else {
      const log = await app.service('logs').create({
        message: e.response.data.error,
        api: 'Autocheck_Helper',
        status: 'ERROR',
        client: userId,
        vin: vin
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'Autocheck_Helper',
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
