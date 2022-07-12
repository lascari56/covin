const fs = require('fs')

exports.editHtml = async (file, source) => {
  console.log('replace contr')
  //what url we should replace
  const sourcesUrlToReplace = {
    oae2: /http:\/\/onlineautoexport.com/g,
    gaga: /http:\/\/autochecker.ga/g,
    haus: /https:\/\/do.carfax.shop/g,
    taurus: /https:\/\/api.carfax.shop/g,
    carfaxPro: /https:\/\/api.carfax.pro/g,
    autocheck: /https:\/\/www.autocheck.com|https:\/\/api.carfax.pro/g,
  }
  const path = `./client/public${file}`

  fs.readFile(path, 'utf-8', async (error, data) => {
    if (error) throw error
    try {
      const fixedFile = data.replace(
        sourcesUrlToReplace[source],
        'https://covin.pro'
      )
      fs.writeFile(path, fixedFile, 'utf-8', function (err) {
        if (err) throw err
      })
    } catch (e) {
      console.log(e)
    }
  })
}
