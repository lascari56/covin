const { Service } = require('feathers-mongoose');
const crypto = require('crypto');

const createModel = require('../../models/billing.model');

const key = '591faa88a7834df2961b268a2755a8cc8a8bbcb9';

exports.Billing = class Billing extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async create (data, params) {
    console.log("data", params);

    const billing = new this.model();

    const bodyReq = {
      merchantAccount: 'covin_frontend_herokuapp_com',
      // merchantAccount: 'test_merch_n1',
      // merchantDomainName: 'http://localhost:3000',
      merchantDomainName: 'https://covin-frontend.herokuapp.com/cabinet/payments',
      orderReference: billing._id,
      orderDate: new Date().getTime(),
      amount: data.amount,
      currency: 'USD',
      // currency: 'UAH',
      productName: 'Balance replenishment',
      productCount: '1',
      productPrice: data.amount,
    };

    const hashArray = Object.values(bodyReq);
    const hashString = hashArray.join(';');
    const hmac = crypto.createHmac('md5', key).update(hashString).digest('hex');
    const billingReq = {
      ...bodyReq,
      language: 'AUTO',
      serviceUrl: 'https://covin-dev.herokuapp.com/billing-status',
      merchantSignature: hmac,
    };

    billing.client = params.user._id;

    await billing.save();

    return billingReq;
  }

  // async patch (id, data, params) {
  //   console.log("data", params);

  //   return true;
  // }
};
