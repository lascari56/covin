const { Service } = require('feathers-mongoose');
const crypto = require('crypto');

const createModel = require('../../models/billing.model');

const key = '3212414acf7d83151b28c2292928bb70a3c05270';

exports.BillingStatus = class BillingStatus extends Service {
  // setup(app) {
  //   this.model = createModel(app);
  //   this.app = app;
  // }

  create (data, params) {
    console.log("wayForPayResponse", data);

  //   // const billing = new this.model();

  //   const wayForPayResponse = JSON.parse(Object.keys(data));
  //   const billing = await this.model().findById(wayForPayResponse.orderReference);
  //   const billingPreviousStatus =
  //     billing.data !== undefined ? billing.data.transactionStatus : 'Pending';

  //   if (wayForPayResponse.orderReference) {
  //     // if (!billing.hasOwnProperty('data')) {
  //     billing.data = wayForPayResponse;
  //     await billing.save();

  //     if (
  //       billing.data.transactionStatus === 'Approved' &&
  //       billingPreviousStatus !== 'Approved'
  //     ) {
  //     //   const client = await User.findById(billing.client)
  //     //   client.balance += billing.data.amount
  //     //   await client.save()
  //     //   const log = new Log({
  //     //     message: billing.data.amount,
  //     //     status: billing.data.transactionStatus,
  //     //     client: billing.client,
  //     //   })
  //     //   await log.save()

  //       const wfpResponse = {
  //         orderReference: wayForPayResponse.orderReference,
  //         status: 'accept',
  //         time: new Date().getTime(),
  //       }
  //       const hashArray = Object.values(wfpResponse)
  //       const hashString = hashArray.join(';')
  //       wfpResponse.signature = crypto
  //         .createHmac('md5', key)
  //         .update(hashString)
  //         .digest('hex')

  //       return wfpResponse;
  //     }
  //   }
  }
};
