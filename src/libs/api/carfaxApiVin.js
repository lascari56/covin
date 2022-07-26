const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')
const key = 'a9993631-b071-4f33-ad88-c893ca487db8'

exports.getReport = async (vin, userId, reBuy, app) => {
  let report = null;
  let checkResult;
  let url = `http://198.199.90.224/api/v1/carfax/check?vincode=${vin}&api_key=${key}`;

  if (!!reBuy) url += `&re_buy=${reBuy}`;

  console.log('IN_APIVIN')

  const checkConfig = {
    method: 'get',
    url,
    headers: {
      Accept: 'application/json',
    },
  }

  await axios(checkConfig)
    .then((response) => {
      console.log(response.status)
      checkResult = {
        isReportExist: response.status === 200,
        message: response.message,
      }
    })
    .catch(function (error) {
      // console.log(error)
      checkResult = {
        isReportExist: false,
        message: error.message,
      }
    })

  if (checkResult.isReportExist) {
    console.log('find report at apivin server')

    const config = {
      method: 'get',
      url: `http://198.199.90.224/api/v1/carfax?vincode=${vin}&api_key=${key}`,
      headers: {
        Accept: 'application/json',
      },
    }

    try {
      await axios(config).then(async (response) => {
        console.log('APIVIN AFTER RESPONSE')
        const filename = `/reports/${vin}_${Date.now()}.html`
        console.warn(filename)
        fs.writeFile(
          `./client/public${filename}`,
          response.data.carfax_data,
          { encoding: 'utf-8' },
          function (err) {
            console.log('File created APIVIN')
          }
        )
        report = {
          vin: vin,
          client: userId,
          file: `https://covin.pro${filename}`,
        }
        console.warn(report)

        await app.service('logs').create({
          api: 'CarFax_ApiVin',
          status: 'SUCCESS',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   api: 'CarFax_ApiVin',
        //   status: 'SUCCESS',
        //   client: userId,
        //   vin: vin,
        // })
        // await log.save()
      })
    } catch (e) {
      await app.service('logs').create({
        message: e.response.data.message,
        api: 'CarFax_ApiVin',
        status: 'ERROR',
        client: userId,
        vin: vin,
      });

      // const log = new Log({
      //   message: e.response.data.message,
      //   api: 'CarFax_ApiVin',
      //   status: 'ERROR',
      //   client: userId,
      //   vin: vin,
      // })
      // await log.save()
    }
    if (report) {
      return report
    }
  } else {
    await app.service('logs').create({
      message: checkResult.message,
      api: 'CarFax_ApiVin',
      status: 'ERROR',
      client: userId,
      vin: vin,
    });

    // const log = new Log({
    //   message: checkResult.message,
    //   api: 'CarFax_ApiVin',
    //   status: 'ERROR',
    //   client: userId,
    //   vin: vin,
    // })
    // await log.save()
  }
}
