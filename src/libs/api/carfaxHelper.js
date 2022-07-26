const axios = require('axios')
// const Log = require('../../models/Log')

exports.getReport = async (vin, userId, reBuy, app) => {
  let report = null
  let checkResult

  console.log('IN HELPER')

  const checkConfig = {
    method: 'get',
    url: 'https://autohelperbot.com/api/check-carfax/' + vin,
    headers: {
      Accept: 'application/json',
      Authorization:
        'Bearer 648105b3ce340e56bac4dc53662288c0ff1a667342a6bf9ddd31755fd8b27b4d',
    },
  }

  await axios(checkConfig)
    .then((response) => {
      console.log(response.data)
      checkResult = response.data
    })
    .catch(function (error) {
      console.log(error)
    })

  if (checkResult.status === 'success') {
    console.log('find report at helper server')

    const config = {
      method: 'get',
      url: 'https://autohelperbot.com/api/get-carfax/' + vin,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer 648105b3ce340e56bac4dc53662288c0ff1a667342a6bf9ddd31755fd8b27b4d',
      },
    }

    try {
      await axios(config).then(async (response) => {
        console.log('HELPER')
        console.log(response.data)
        if (response.data.status !== 'failed') {
          report = {
            order_token: response.data.order_token,
            status: 'SUCCESS',
            vin: vin,
            client: userId,
          }
          console.log(report)

          await app.service('logs').create({
            api: 'Carfax_Helper',
            status: 'SUCCESS',
            client: userId,
            vin: vin,
          });

          // const log = new Log({
          //   api: 'Carfax_Helper',
          //   status: 'SUCCESS',
          //   client: userId,
          //   vin: vin,
          // })
          // await log.save()
        } else {
          await app.service('logs').create({
            message: response.data.message,
            api: 'Carfax_Helper',
            status: response.data.status.toUpperCase(),
            client: userId,
            vin: vin,
          });

          // const log = new Log({
          //   message: response.data.message,
          //   api: 'Carfax_Helper',
          //   status: response.data.status.toUpperCase(),
          //   client: userId,
          //   vin: vin,
          // })
          // await log.save()
        }
      })
    } catch (e) {
      console.log(e)
      if (e.response.status === 406) {
        await app.service('logs').create({
          message: e.response.data.error,
          api: 'Carfax_Helper',
          status: 'FAILED',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   message: e.response.data.error,
        //   api: 'Carfax_Helper',
        //   status: 'FAILED',
        //   client: userId,
        //   vin: vin,
        // })
        // await log.save()
      } else {
        await app.service('logs').create({
          message: e.response.data.error,
          api: 'Carfax_Helper',
          status: 'ERROR',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   message: e.response.data.error,
        //   api: 'Carfax_Helper',
        //   status: 'ERROR',
        //   client: userId,
        //   vin: vin,
        // })
        // await log.save()
      }
    }
    if (report) {
      return report
    }
  } else {
    await app.service('logs').create({
      message: checkResult.message,
      api: 'Carax_Helper',
      status: checkResult.status.toUpperCase(),
      client: userId,
      vin: vin,
    });

    // const log = new Log({
    //   message: checkResult.message,
    //   api: 'Carax_Helper',
    //   status: checkResult.status.toUpperCase(),
    //   client: userId,
    //   vin: vin,
    // })
    // await log.save()
  }
}
