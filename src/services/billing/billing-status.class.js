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
    try {
      console.log("wayForPayResponse", data);

      // const billing = new this.model();

      // const wayForPayResponse = data;

      const wayForPayResponse = JSON.parse(Object.keys(data));
      // const wayForPayResponse = data;
      // const billing = await this.model.findById(wayForPayResponse.orderReference);
      let billing = await this.app.service("billing").get(wayForPayResponse.orderReference);

      // let client = await this.app.service("users").Model.findById(billing.client);

      // client.balance += 1;

      // client.balance = client.balance.toFixed(2);

      // return await this.app.service("users").Model.findOneAndUpdate({_id: client._id}, {balance: client.balance});
      // {balance: client.balance}

      // await client.save();

      // return client;

      // const res = await this.app.service("billing").update(billing._id, {
      //   ...billing,
      //   data: wayForPayResponse,
      // });

      // return {"data": res};

      const billingPreviousStatus = billing?.data && billing?.data?.transactionStatus ? billing?.data?.transactionStatus : 'Pending';

      // console.log('====================================');
      // console.log("billingPreviousStatus", {billingPreviousStatus, wayForPayResponse: wayForPayResponse.transactionStatus});
      // console.log('====================================');
      // return billingPreviousStatus;

      if (wayForPayResponse.orderReference) {
        billing = await this.app.service("billing").update(billing._id, {
          ...billing,
          data: wayForPayResponse,
        });


        // return billingPreviousStatus;

        // console.log("res",  wayForPayResponse.transactionStatus === 'Approved' && billingPreviousStatus !== 'Approved');

        if (
          wayForPayResponse.transactionStatus !== 'Refunded' &&
          wayForPayResponse.transactionStatus === 'Approved' &&
          billingPreviousStatus !== 'Approved'
        ) {
          const client = await this.app.service("users").Model.findById(billing.client);

          client.balance += billing.data.amount;
          client.balance = client.balance.toFixed(2);

          await this.app.service("users").Model.findOneAndUpdate({_id: client._id}, {balance: client.balance})

          // await client.save();

          await this.app.service("logs").create({
            message: billing.data.amount,
            status: billing.data.transactionStatus,
            client: billing.client,
          });

          const wfpResponse = {
            orderReference: wayForPayResponse.orderReference,
            status: 'accept',
            time: new Date().getTime(),
          };

          const hashArray = Object.values(wfpResponse);
          const hashString = hashArray.join(';');
          wfpResponse.signature = crypto
            .createHmac('md5', key)
            .update(hashString)
            .digest('hex');

          return wfpResponse;
        }
      }

      return true;
    } catch (error) {
      console.log("err", error);
    }
  }
};
