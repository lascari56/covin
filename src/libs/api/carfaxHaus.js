const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')
const key = 'WA1AVAF11KD016693&key=31474b4d7a614635377861534b65514f703767386c4b31566a7555746152465432413d3d'

exports.getReport = async (vin, userId, reBuy, app) => {
  let report = null
  let checkResult

  console.log('IN_Haus')

  const config = {
    method: 'get',
    url: `https://do.carfax.shop/?vin=${vin}&key=${key}`,
    headers: {
      Accept: 'application/json',
    },
  }

  try {
    await axios(config).then(async (response) => {
      if(response.data.includes('{"status":"error"}')){
        throw new Error('No report found')
      }

      const filename = `/reports/${vin}_${Date.now()}.html`
      console.warn(filename)
      fs.writeFile(
        `./client/public${filename}`,
        response.data,
        { encoding: 'utf-8' },
        async function (err) {
          console.log('File created Haus')
          await editHtml(filename, 'haus')

        }
      )
      report = {
        vin: vin,
        client: userId,
        file: `https://covin.pro${filename}`,
      }
      console.warn(report)

      await app.service('logs').create({
        api: 'CarFax_Haus',
        status: 'SUCCESS',
        client: userId,
        vin: vin,
      });

      // const log = new Log({
      //   api: 'CarFax_Haus',
      //   status: 'SUCCESS',
      //   client: userId,
      //   vin: vin,
      // })
      // await log.save()
    })
  } catch (e) {
    await app.service('logs').create({
      message: e.message,
      api: 'CarFax_Haus',
      status: 'ERROR',
      client: userId,
      vin: vin,
    });

    // const log = new Log({
    //   message: e.message,
    //   api: 'CarFax_Haus',
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
