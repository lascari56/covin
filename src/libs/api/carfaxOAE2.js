const axios = require('axios')
// const Log = require('../../models/Log')
const http = require('http')
const fs = require('fs')
const { editHtml } = require('../../controllers/replaceController')

exports.getReport = async (vin, userId, app) => {

  let report = null
  const data = { vin: vin }

  const config = {
    method: 'post',
    url: 'http://193.106.200.175:8000/api/oae/',
    headers: {
      'Authorization': 'VINTOKEN a3707f37c811768eb067f15c40e6046f9d2e1645'
    },
    data: data
  }

  try {
    await axios(config).then( async response => {

      // const filename = `/reports/${vin}_${Date.now()}.html`
      // const fileReport = fs.createWriteStream(`./client/public${filename}`)
      // const fileUrl = response.data.report
      // const requestForFile = await http.get(fileUrl, function (resFile) {
      //   const write = resFile.pipe(fileReport)
      //   write.on('finish', () => {
      //     editHtml(filename, 'oae2')
      //   })
      // })

      let fileLink = response.data.report.replace(/:8000\/file/g, ":8001")

      report = {
        vin: vin,
        client: userId,
        file: fileLink,
        // file: `https://covin.pro${filename}`,
      }
      report.file.replace(/:8000\/file/g, ":8001")
      const log = new Log({
        api: 'CarFax_OAE2',
        status: 'SUCCESS',
        client: userId,
        vin: vin
      })
      await log.save()
    })
  } catch (e) {
    if(e.response.status === 406) {
      const log = new Log({
        message: e.response.data.error,
        api: 'CarFax_OAE2',
        status: 'FAILED',
        client: userId,
        vin: vin
      })
      await log.save()
    } else {
      const log = new Log({
        message: e.response.data.error,
        api: 'CarFax_OAE2',
        status: 'ERROR',
        client: userId,
        vin: vin
      })
      await log.save()
    }
  }
  if (report) {
    return report
  }
}
