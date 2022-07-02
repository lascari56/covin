const crypto = require('crypto');

// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String},
    username: {type: String},
    phone: {type: String},
    balance: {type: Number, default: 0},
    status: {type: Boolean, default: 1},
    group: {type: String, default: "new"},
    role: {type: String, default: "user"},
    price: {type: JSON, default: {carfax: null, autocheck: null, sticker: null}},
    token: {type: String},
    domain: {type: String},
    g_uid: {type: String},
    g_name: {type: String},
    registration_date: {type: Date, default: Date.now},
    ip: {type: String},
    country: {type: String},
    rep: {type: JSON},
    comment: {type: String},
    // reports: [{ type: mongooseClient.Types.ObjectId, ref: 'Report' }],
    // billings: [{ type: mongooseClient.Types.ObjectId, ref: 'Billing' }],
    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpires: {
      type: Date,
      required: false
    }
  }, {
    timestamps: true
  });

  schema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
  };

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
