const { Service } = require('feathers-mongoose');
const crypto = require('crypto');

const createModel = require('../../models/billing.model');

const key = '3212414acf7d83151b28c2292928bb70a3c05270';

exports.Billing = class Billing extends Service {
  setup(app) {
    this.model = createModel(app);
    this.app = app;
  }

  async create (data, params) {
    console.log("data", params);

    const billing = new this.model();

    const bodyReq = {
      merchantAccount: 'covin_pro',
      // merchantAccount: 'test_merch_n1',
      // merchantDomainName: 'http://localhost:3000',
      merchantDomainName: 'https://covin-frontend.herokuapp.com',
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
      serviceUrl: 'http://localhost:3030/billing-status',
      merchantSignature: hmac,
    };

    billing.client = params.user._id;

    await billing.save();

    return billingReq;
  }
};
