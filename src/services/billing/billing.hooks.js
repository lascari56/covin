const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [
      // authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      authenticate('jwt')
      // async (context) => {
      //   console.log("context", context);
      //   const billing = new Billing();

      //   const bodyReq = {
      //     merchantAccount: 'covin_pro',
      //     // merchantAccount: 'test_merch_n1',
      //     merchantDomainName: 'https://covin.pro',
      //     orderReference: billing._id,
      //     orderDate: new Date().getTime(),
      //     amount: req.body.amount,
      //     currency: 'USD',
      //     // currency: 'UAH',
      //     productName: 'Balance replenishment',
      //     productCount: '1',
      //     productPrice: req.body.amount,
      //   };

      //   const hashArray = Object.values(bodyReq);
      //   const hashString = hashArray.join(';');
      //   const hmac = crypto.createHmac('md5', key).update(hashString).digest('hex');
      //   const billingReq = {
      //     ...bodyReq,
      //     language: 'AUTO',
      //     serviceUrl: 'https://covin.pro/api/billing/billing-status',
      //     merchantSignature: hmac,
      //   };

      //   billing.client = req.user.userId;
      //   await billing.save();

      //   res.json(billingReq);
      //   return context;
      // }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
