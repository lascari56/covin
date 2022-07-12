const carfaxGaga = require('./carfaxGaga')
const carfaxHelper = require('./carfaxHelper')
const carfaxDVCH = require('./carfaxDVCH')
const carfaxOAE = require('./carfaxOAE')
const carfaxOAE2 = require('./carfaxOAE2')
const carfaxOAE3 = require('./carfaxOAE3')
const carfaxCPRO = require('./carfaxCPRO')
const autocheckCPRO = require('./autocheckCPRO')
const carfaxApiVin = require('./carfaxApiVin')
const autocheckHelper = require('./autocheckHelper')
const stickerWithClutch = require('./stickerWithClutch')
const carfaxHaus = require('./carfaxHaus')
const carfaxTaurus = require('./carfaxTaurus')

exports.Apis = {
  CarFax_GAGA: carfaxGaga,
  CarFax_Haus: carfaxHaus,
  CarFax_Taurus: carfaxTaurus,
  CarFax_Helper: carfaxHelper,
  CarFax_DVCH: carfaxDVCH,
  CarFax_OAE: carfaxOAE,
  CarFax_OAE2: carfaxOAE2,
  CarFax_OAE3: carfaxOAE3,
  CarFax_ApiVin: carfaxApiVin,
  CarFax_CPRO: carfaxCPRO,
  Autocheck_CPRO: autocheckCPRO,
  Sticker_WithClutch: stickerWithClutch,
  'AutoCheck Helper ': autocheckHelper,
}
