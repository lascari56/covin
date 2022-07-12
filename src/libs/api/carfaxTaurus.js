const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')
const key = '6964597355795538436b2f745645392f4e73462b62413975634c5a516b2f752b6572553d'

exports.getReport = async (vin, userId, app) => {
  let report = null
  let checkResult

  console.log('IN_Taurus')

  const config = {
    method: 'get',
    url: `https://api.carfax.shop/report/getreport?key=${key}&vin=${vin}`,
    headers: {
      Accept: 'application/json',
    },
  }

  try {
    await axios(config).then(async (response) => {
      console.warn('IN_Taurus_response')
      console.warn(response)
      if(response.data === '\n'){
        throw new Error('No report found')
      }

      const filename = `/reports/${vin}_${Date.now()}.html`
      console.warn(filename)
      fs.writeFile(
        `./client/public${filename}`,
        response.data,
        { encoding: 'utf-8' },
        async function (err) {
          console.log('File created Taurus')
          await editHtml(filename, 'taurus')

        }
      )
      report = {
        vin: vin,
        client: userId,
        file: `https://covin.pro${filename}`,
      }
      console.warn(report)

      await app.service('logs').create({
        api: 'CarFax_Taurus',
        status: 'SUCCESS',
        client: userId,
        vin: vin,
      });

      // const log = new Log({
      //   api: 'CarFax_Taurus',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin,
      // })
      // await log.save()
    })
  } catch (e) {
    await app.service('logs').create({
      message: e.message,
      api: 'CarFax_Taurus',
      status: 'ERROR',
      client: userId,
      vin: vin,
    });

    // const log = new Log({
    //   message: e.message,
    //   api: 'CarFax_Taurus',
    //   status: 'ERROR',
    //   client: userId,
    //   vin: vin,
    // })
    // await log.save()
  }

  if (report) {
    return report
  }
}
