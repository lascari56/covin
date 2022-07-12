const axios = require('axios')
// const Log = require('../../models/Log')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')

exports.getReport = async (vin, userId, app) => {
  let report = null
  let checkResult
  // const apiKey = 'e67ae95b59bd4f637d3ff804da40fe80'
  //prod
  const apiKey = '1e8aaa859c37854c1ad982280b7ff752'

  console.log('IN CPRO')

  const checkConfig = {
    method: 'get',
    url: 'https://api.carfax.pro/wp-json/v1/get_report_check/' + vin,
    headers: {
      Accept: 'application/json',
    },
  }

  await axios(checkConfig)
    .then((response) => {
      console.log(response.data)
      checkResult = response.data?.carfax
    })
    .catch(function (error) {
      console.log(error)
    })

  if (checkResult?.Model || checkResult?.Vehicle) {
    console.log('find report at carfax CPRO')

    const config = {
      method: 'get',
      url:
        'https://api.carfax.pro/wp-json/v1/get_report_by_wholesaler/' +
        vin +
        '/' +
        apiKey +
        '/carfax/en',
      headers: {
        Accept: 'application/json',
      },
    }

    try {
      await axios(config).then(async (response) => {
        console.log('CPRO')
        // console.log(response.data)
        if (response.data?.report) {
          const file_data = response.data.report.report
          const filename = `/reports/${vin}_${Date.now()}.html`
          fs.writeFile(
            `./client/public${filename}`,
            file_data,
            { encoding: 'base64' },
            function (err) {
              console.log('File created CPRO')
              editHtml(filename, 'carfaxPro')
            }
          )
          const uploadedFile = `https://covin.pro${filename}`

          report = {
            order_token: response.data.report.report_hash,
            status: 'Success',
            vin: vin,
            client: userId,
            file: uploadedFile,
          }

          await app.service('logs').create({
            api: 'Carfax_CPRO',
            status: 'SUCCESS',
            client: userId,
            vin: vin,
          });

          // const log = new Log({
          //   api: 'Carfax_CPRO',
          //   status: 'SUCCESS',
          //   client: userId,
          //   vin: vin,
          // })
          // await log.save()
        } else {
          await app.service('logs').create({
            message: response.data.message,
            api: 'Carfax_CPRO',
            status: 'ERROR',
            client: userId,
            vin: vin,
          });

          // const log = new Log({
          //   message: response.data.message,
          //   api: 'Carfax_CPRO',
          //   status: 'ERROR',
          //   client: userId,
          //   vin: vin,
          // })
          // await log.save()
        }
      })
    } catch (e) {
      console.log(e)
      if (e.response.status === 404) {
        await app.service('logs').create({
          message: e.response.data.error,
          api: 'Carfax_CPRO',
          status: 'FAILED',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   message: e.response.data.error,
        //   api: 'Carfax_CPRO',
        //   status: 'FAILED',
        //   client: userId,
        //   vin: vin,
        // })
        // await log.save()
      } else {
        await app.service('logs').create({
          message: e.response.data.error,
          api: 'Carfax_CPRO',
          status: 'ERROR',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   message: e.response.data.error,
        //   api: 'Carfax_CPRO',
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
      api: 'Carax_CPRO',
      status: 'ERROR',
      client: userId,
      vin: vin,
    });

    // const log = new Log({
    //   message: checkResult.message,
    //   api: 'Carax_CPRO',
    //   status: 'ERROR',
    //   client: userId,
    //   vin: vin,
    // })
    // await log.save()
  }
}
