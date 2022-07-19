const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')
const Console = require('console')
const https = require('https')

exports.getReport = async (vin, userId, app) => {
  let report = null
  const data = { vin: vin }

  const config = {
    method: 'post',
    url: 'https://us-central1-withclutch.cloudfunctions.net/getsticker',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5NDYsInVzZXJOYW1lIjoia2F6eXVrdDExMDEiLCJlbWFpbCI6Imthenl1ay50QGdtYWlsLmNvbSIsImlhdCI6MTYzNTg0MzEzOX0.8dUlUoS1xE3VtVjUVgIXhdOabHOdCxJRKiOmxaepX0o'
    },
    data: data
  }

  try {
    await axios(config).then( async response => {

      report = {
        vin: vin,
        client: userId,
        file: response.data.data.stickerUrl || null}
      if (report.file) {
        await app.service('logs').create({
          api: 'STICKER',
          status: 'SUCCESS',
          client: userId,
          vin: vin
        });

        // const log = new Log({
        //   api: 'STICKER',
        //   status: 'SUCCESS',
        //   client: userId,
        //   vin: vin
        // })
        // await log.save()
        const filename = `/reports/${vin}_${Date.now()}.pdf`
        const fileReport = fs.createWriteStream(`./public${filename}`)
        const fileUrl = response.data.data.stickerUrl
        await https.get(fileUrl, function (resFile) {
          resFile.pipe(fileReport)
        })
        report.file = `https://covin-dev.herokuapp.com${filename}`
        report.status = 'Success'
        return report
      } else {
        console.warn('not exist')

        await app.service('logs').create({
          message: 'report doesn\'t exist',
          api: 'STICKER',
          status: 'ERROR',
          client: userId,
          vin: vin
        });

        // const log = new Log({
        //   message: 'report doesn\'t exist',
        //   api: 'STICKER',
        //   status: 'ERROR',
        //   client: userId,
        //   vin: vin
        // })
        // await log.save()
        report.status = 'error'
        console.warn(report)
        return report
      }
    })
  } catch (e) {
    console.warn('err')
    console.warn(e)

    await app.service('logs').create({
      message: e.response,
      api: 'STICKER',
      status: 'ERROR',
      client: userId,
      vin: vin
    });

    // const log = new Log({
    //   message: e.response,
    //   api: 'STICKER',
    //   status: 'ERROR',
    //   client: userId,
    //   vin: vin
    // })
    report = {status: 'error'}
    // await log.save()
    return report
  }
  if (report) {
    return report
  }
}
