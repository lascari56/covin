const { Service } = require('feathers-mongoose');
const crypto = require('crypto');

const createModel = require('../../models/billing.model');
const createModelUser = require('../../models/users.model');

const key = '591faa88a7834df2961b268a2755a8cc8a8bbcb9';

exports.BillingStatus = class BillingStatus extends Service {
  setup(app) {
    this.model = createModel(app);
    this.modelUser = createModelUser(app);
    this.app = app;
  }

  async create (data) {
    console.log("wayForPayResponse", data);

  //   // const billing = new this.model();

    // const wayForPayResponse = JSON.parse(Object.keys(data));
    const billing = await this.model.findById(data.orderReference);

    // return billing;

    const billingPreviousStatus =
      billing.data !== undefined ? billing.data.transactionStatus : 'Pending';

    if (data.orderReference) {

      let res = await this.model.findOneAndUpdate(data.orderReference, {
        data,
      });

      // console.log("res", res);

      // billing.data = data;
      // await billing.save();

      if (
        billing.data.transactionStatus === 'Approved' &&
        billingPreviousStatus !== 'Approved'
      ) {
        const client = await this.modelUser.findById(billing.client);

        client.balance += billing.data.amount;

        await client.save();

        await this.app.services["lots"].create(billing.client, {
          message: billing.data.amount,
          status: billing.data.transactionStatus,
          client: billing.client,
        });

        // const wfpResponse = {
        //   orderReference: data.orderReference,
        //   status: 'accept',
        //   time: new Date().getTime(),
        // };

        // const hashArray = Object.values(wfpResponse);
        // const hashString = hashArray.join(';');
        // wfpResponse.signature = crypto
        //   .createHmac('md5', key)
        //   .update(hashString)
        //   .digest('hex');

        return true;
      }
    }
  }
};
