const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')

exports.getReport = async (vin, userId, app) => {
  let report = null

  const config = {
    method: 'get',
    url:
      'http://autochecker.ga/report/?vin=' +
      vin +
      '&type=json&token=359cc0c25d8c88501473f4da0ab20083',
    headers: {
      Accept: 'application/json',
    },
  }

  try {
    await axios(config).then(async (response) => {
      console.log('GAGA AFTER RESPONSE')
      if (typeof response.data === 'object' && 'html' in response.data) {
        const filename = `/reports/${vin}_${Date.now()}.html`
        const fileReport = fs.createWriteStream(`./client/public${filename}`)
        const fileUrl = response.data.html.url
        const requestForFile = await http.get(fileUrl, function (resFile) {
          const write = resFile.pipe(fileReport)
          write.on('finish', () => {
            editHtml(filename, 'gaga')
          })
        })

        report = {
          vin: vin,
          client: userId,
          file: `https://covin.pro${filename}`,
        }

        await app.service('logs').create({
          api: 'Carfax_GAGA',
          status: 'SUCCESS',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   api: 'Carfax_GAGA',
        //   status: 'SUCCESS',
        //   client: userId,
        //   vin: vin,
        // })
        // await log.save()
      } else {
        await app.service('logs').create({
          message: 'Report not found',
          api: 'Carfax_GAGA',
          status: 'ERROR',
          client: userId,
          vin: vin,
        });

        // const log = new Log({
        //   message: 'Report not found',
        //   api: 'Carfax_GAGA',
        //   status: 'ERROR',
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
        api: 'Carfax_GAGA',
        status: 'FAILED',
        client: userId,
        vin: vin,
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'Carfax_GAGA',
      //   status: 'FAILED',
      //   client: userId,
      //   vin: vin,
      // })
      // await log.save()
    } else {
      await app.service('logs').create({
        message: e.response.data.error,
        api: 'Carfax_GAGA',
        status: 'ERROR',
        client: userId,
        vin: vin,
      });

      // const log = new Log({
      //   message: e.response.data.error,
      //   api: 'Carfax_GAGA',
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
}
